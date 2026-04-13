const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ========== Helper Functions ==========

// استخراج الوصف من الصورة باستخدام GPT-4 Vision
async function extractDescriptionFromImage(imageDataUrl) {
  try {
    console.log('📸 Starting image analysis with OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `قم بتحليل هذه الصورة وحدد نوع الشيء الموجود فيها بدقة.

تعليمات مهمة جداً:
1. انظر بعناية للصورة
2. اختر التصنيف الأنسب من القائمة أدناه
3. استخدم الكلمة بالضبط كما في القائمة

أمثلة التصنيف:
- كاميرا تصوير (Canon، Nikon، Sony مع عدسة) → "كاميرا"
- جهاز لوحي (iPad، Samsung Tab) → "تابلت"  
- كمبيوتر محمول (MacBook، Dell، HP) → "لابتوب"
- هاتف محمول (iPhone، Samsung Galaxy) → "هاتف"
- سماعات أذن (AirPods، headphones، earbuds) → "سماعات رأس"
- حقيبة ظهر (backpack) → "حقيبة ظهر"
- حقيبة يد (handbag، purse) → "حقيبة"
- ساعة يد (watch، smartwatch) → "ساعة"
- مجوهرات وحلي:
  * خاتم (ring) → "مجوهرات"
  * قلادة (necklace) → "مجوهرات"
  * سوار (bracelet) → "مجوهرات"
  * أقراط (earrings) → "مجوهرات"
  * بروش (brooch) → "مجوهرات"
  * سلسال ذهب أو فضة → "مجوهرات"
  * أي حلي معدنية ثمينة → "مجوهرات"

القائمة الكاملة للأنواع المتاحة:
حقيبة، حقيبة ظهر، هاتف، محفظة، مفاتيح، نظارات، ساعة، لابتوب، تابلت، كاميرا، سماعات رأس، مجوهرات، جواز سفر، بطاقة هوية، مستندات، أخرى

ملاحظة: إذا رأيت أي شيء يلمع أو معدني أو يبدو كحلي → اختر "مجوهرات"

أجب فقط بصيغة JSON بدون أي نص إضافي:
{
  "color": "اللون الرئيسي (أسود، أبيض، أزرق، أحمر، أخضر، أصفر، بني، رمادي، برتقالي، وردي، بنفسجي، ذهبي، فضي، متعدد الألوان)",
  "item_type": "النوع (اختر من القائمة أعلاه بالضبط)",
  "size": "الحجم (صغير، متوسط، كبير)"
}`
            },
            {
              type: "image_url",
              image_url: { url: imageDataUrl }
            }
          ]
        }
      ],
      max_tokens: 150
    });

    const responseText = response.choices[0].message.content.trim();
    console.log('🤖 OpenAI Response:', responseText);
    
    // إزالة markdown formatting إذا وجد
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const description = JSON.parse(cleanedText);
    
    console.log('✅ Parsed description:', description);
    return description;
  } catch (error) {
    console.error('❌ Error extracting description:', error.message);
    return { color: 'غير محدد', item_type: 'أخرى', size: 'متوسط' };
  }
}

// ========== Admin Routes ==========

// تسجيل مسؤول جديد
app.post('/api/admin/register', async (req, res) => {
  try {
    const { civil_id, password, email } = req.body;

    if (!civil_id || !password || !email) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{ civil_id, password_hash, email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'السجل المدني أو البريد مسجل مسبقاً' });
      }
      throw error;
    }

    res.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح',
      admin_id: data.id 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'خطأ في إنشاء الحساب' });
  }
});

// تسجيل دخول المسؤول
app.post('/api/admin/login', async (req, res) => {
  try {
    const { civil_id, password } = req.body;

    if (!civil_id || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('civil_id', civil_id)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    res.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      admin_id: admin.id,
      email: admin.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
  }
});

// رفع صورة المفقودات
app.post('/api/admin/upload', upload.single('image'), async (req, res) => {
  try {
    const { found_date, admin_id } = req.body;
    const file = req.file;

    if (!file || !found_date || !admin_id) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // رفع الصورة إلى Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lost-items-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // الحصول على الرابط العام للصورة
    const { data: urlData } = supabase.storage
      .from('lost-items-images')
      .getPublicUrl(fileName);

    // استخراج الوصف من الصورة
    console.log('🤖 Calling AI to extract description...');
    const imageBase64 = file.buffer.toString('base64');
    const imageDataUrl = `data:${file.mimetype};base64,${imageBase64}`;
    const description = await extractDescriptionFromImage(imageDataUrl);

    console.log('Extracted description:', description);

    // حفظ البيانات في قاعدة البيانات
    const { data: itemData, error: dbError } = await supabase
      .from('lost_items')
      .insert([{
        image_url: urlData.publicUrl,
        found_date: found_date,
        uploaded_by: admin_id,
        color: description.color,
        item_type: description.item_type,
        size: description.size
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    res.json({ 
      success: true, 
      message: 'تم رفع المفقودات بنجاح',
      item: itemData,
      description: description
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'خطأ في رفع الصورة' });
  }
});

// جلب جميع المفقودات
app.get('/api/admin/items', async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('lost_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      items: items || []
    });
  } catch (error) {
    console.error('Fetch items error:', error);
    res.status(500).json({ error: 'خطأ في جلب البيانات' });
  }
});

// حذف مفقود
app.delete('/api/admin/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id } = req.body;

    if (!admin_id) {
      return res.status(401).json({ error: 'غير مصرح' });
    }

    // جلب معلومات المفقود
    const { data: item, error: fetchError } = await supabase
      .from('lost_items')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // حذف الصورة من Storage
    if (item && item.image_url) {
      const fileName = item.image_url.split('/').pop();
      await supabase.storage
        .from('lost-items-images')
        .remove([fileName]);
    }

    // حذف السجل
    const { error: deleteError } = await supabase
      .from('lost_items')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ 
      success: true, 
      message: 'تم حذف المفقود بنجاح'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'خطأ في الحذف' });
  }
});

// ========== Client Routes ==========

// تسجيل عميل جديد
app.post('/api/client/register', async (req, res) => {
  try {
    const { civil_id, password, email, full_name, phone } = req.body;

    if (!civil_id || !password || !email || !full_name || !phone) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('clients')
      .insert([{ civil_id, password_hash, email, full_name, phone }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'السجل المدني أو البريد مسجل مسبقاً' });
      }
      throw error;
    }

    res.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح',
      client_id: data.id,
      full_name: data.full_name 
    });
  } catch (error) {
    console.error('Client register error:', error);
    res.status(500).json({ error: 'خطأ في إنشاء الحساب' });
  }
});

// تسجيل دخول العميل
app.post('/api/client/login', async (req, res) => {
  try {
    const { civil_id, password } = req.body;

    if (!civil_id || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('civil_id', civil_id)
      .single();

    if (error || !client) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const isValid = await bcrypt.compare(password, client.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    res.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      client_id: client.id,
      full_name: client.full_name,
      email: client.email
    });
  } catch (error) {
    console.error('Client login error:', error);
    res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
  }
});

// البحث عن المفقودات
app.post('/api/search', upload.single('image'), async (req, res) => {
  try {
    const { lost_date, client_id, search_type, color, item_type, size } = req.body;
    const file = req.file;

    if (!lost_date) {
      return res.status(400).json({ error: 'تاريخ الفقدان مطلوب' });
    }

    let matches = [];

    // البحث بالصورة
    if (search_type === 'image' && file) {
      const clientImageBase64 = file.buffer.toString('base64');
      const clientImageDataUrl = `data:${file.mimetype};base64,${clientImageBase64}`;

      // جلب المفقودات من تاريخ الفقدان حتى اللحظة الحالية
      const currentDateTime = new Date().toISOString();
      
      const { data: lostItems, error: fetchError } = await supabase
        .from('lost_items')
        .select('*')
        .gte('found_date', lost_date)
        .lte('created_at', currentDateTime);

      console.log(`🔍 Searching items found from ${lost_date} until now (${currentDateTime})`);

      if (fetchError) throw fetchError;

      // ترتيب حسب الأقرب لتاريخ الفقدان
      if (lostItems && lostItems.length > 0) {
        const lostDateObj = new Date(lost_date);
        
        lostItems.forEach(item => {
          const foundDateObj = new Date(item.found_date);
          const diffTime = foundDateObj - lostDateObj;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          item.daysDifference = diffDays;
        });
        
        lostItems.sort((a, b) => a.daysDifference - b.daysDifference);
        
        console.log(`📅 Found ${lostItems.length} items sorted by closest to lost date`);
        if (lostItems.length > 0) {
          console.log(`   Closest item: ${lostItems[0].found_date} (${lostItems[0].daysDifference} days after)`);
        }
      }

      if (!lostItems || lostItems.length === 0) {
        if (client_id) {
          await supabase.from('search_logs').insert([{
            client_id: parseInt(client_id),
            lost_date: lost_date,
            results_found: false,
            search_type: 'image'
          }]);
        }
        return res.json({ 
          success: true, 
          found: false, 
          message: `No items found from ${lost_date} until now` 
        });
      }

      // مقارنة الصور - فحص كل الصور المتاحة
      console.log(`🔄 Comparing with ALL ${lostItems.length} items...`);
      
      for (const item of lostItems) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
              role: "user",
              content: [
                {
                  type: "text",
                  text: `قارن بين هاتين الصورتين وأخبرني بنسبة التطابق من 0 إلى 100.

قواعد المقارنة:
- إذا كانا نفس النوع من الأشياء (هاتفين، حقيبتين، تابلتين) → ابدأ من 60%
- إذا اللون متشابه → أضف 15%
- إذا الحجم متشابه → أضف 10%
- إذا الشكل العام متشابه → أضف 15%
- لا تتطلب تطابق كامل في الزاوية أو الإضاءة
- ركز على نوع الشيء أولاً، ثم اللون، ثم الشكل

أجب فقط برقم النسبة (مثال: 75)`
                },
                { type: "image_url", image_url: { url: clientImageDataUrl } },
                { type: "image_url", image_url: { url: item.image_url } }
              ]
            }],
            max_tokens: 50
          });

          const similarityText = response.choices[0].message.content.trim();
          const similarity = parseInt(similarityText.match(/\d+/)?.[0] || '0');

          console.log(`  Comparing with item ${item.id}: ${similarity}%`);

          if (similarity >= 50) {
            console.log(`    ✅ Match found! Adding to results. (${item.daysDifference} days from lost date)`);
            matches.push({
              image_url: item.image_url,
              found_date: item.found_date,
              similarity: similarity,
              color: item.color,
              item_type: item.item_type,
              size: item.size,
              days_difference: item.daysDifference
            });
          } else {
            console.log(`    ❌ Below threshold (50%)`);
          }
        } catch (error) {
          console.error('OpenAI comparison error:', error);
        }
      }
    }
    // البحث بالوصف
    else if (search_type === 'description' && (color || item_type || size)) {
      console.log('🔍 Description Search:', { color, item_type, size });
      
      const currentDateTime = new Date().toISOString();
      
      const { data: allItems, error: fetchError } = await supabase
        .from('lost_items')
        .select('*')
        .gte('found_date', lost_date)
        .lte('created_at', currentDateTime);

      console.log(`📦 Items found from ${lost_date} until now:`, allItems?.length || 0);

      if (fetchError) throw fetchError;

      if (allItems && allItems.length > 0) {
        const lostDateObj = new Date(lost_date);
        allItems.forEach(item => {
          const foundDateObj = new Date(item.found_date);
          const diffTime = foundDateObj - lostDateObj;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          item.daysDifference = diffDays;
        });
        allItems.sort((a, b) => a.daysDifference - b.daysDifference);

        const filteredItems = allItems.filter(item => {
          let colorMatch = true;
          let typeMatch = true;
          let sizeMatch = true;

          if (color && color !== 'الكل') {
            if (color === 'غير محدد') {
              colorMatch = !item.color || item.color === 'غير محدد';
            } else {
              colorMatch = item.color === color;
            }
          }

          if (item_type && item_type !== 'الكل') {
            if (item_type === 'غير محدد' || item_type === 'أخرى') {
              typeMatch = !item.item_type || item.item_type === 'غير محدد' || item.item_type === 'أخرى';
            } else {
              typeMatch = item.item_type === item_type;
            }
          }

          if (size && size !== 'الكل') {
            if (size === 'غير محدد') {
              sizeMatch = !item.size || item.size === 'غير محدد';
            } else {
              sizeMatch = item.size === size;
            }
          }

          return colorMatch && typeMatch && sizeMatch;
        });

        console.log('✅ Filtered items:', filteredItems.length);

        matches = filteredItems.map(item => {
          let matchCount = 0;
          let totalCriteria = 0;

          if (color && color !== 'الكل') {
            totalCriteria++;
            if (color === 'غير محدد' && (!item.color || item.color === 'غير محدد')) {
              matchCount++;
            } else if (item.color === color) {
              matchCount++;
            }
          }
          
          if (item_type && item_type !== 'الكل') {
            totalCriteria++;
            if ((item_type === 'غير محدد' || item_type === 'أخرى') && 
                (!item.item_type || item.item_type === 'غير محدد' || item.item_type === 'أخرى')) {
              matchCount++;
            } else if (item.item_type === item_type) {
              matchCount++;
            }
          }
          
          if (size && size !== 'الكل') {
            totalCriteria++;
            if (size === 'غير محدد' && (!item.size || item.size === 'غير محدد')) {
              matchCount++;
            } else if (item.size === size) {
              matchCount++;
            }
          }

          const similarity = totalCriteria > 0 ? Math.round((matchCount / totalCriteria) * 100) : 100;

          return {
            image_url: item.image_url,
            found_date: item.found_date,
            similarity: similarity,
            color: item.color || 'غير محدد',
            item_type: item.item_type || 'غير محدد',
            size: item.size || 'غير محدد',
            days_difference: item.daysDifference
          };
        });
      }

      if (client_id) {
        await supabase.from('search_logs').insert([{
          client_id: parseInt(client_id),
          lost_date: lost_date,
          results_found: matches.length > 0,
          search_type: 'description',
          search_color: color,
          search_item_type: item_type,
          search_size: size
        }]);
      }
    } else {
      return res.status(400).json({ error: 'يجب تحديد طريقة البحث (صورة أو وصف)' });
    }

    // ترتيب النتائج
    matches.sort((a, b) => b.similarity - a.similarity);

    console.log(`\n📊 Total matches found: ${matches.length}`);
    if (matches.length > 0) {
      console.log('🎯 Top matches:');
      matches.slice(0, 5).forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.similarity}% - ${m.item_type || 'N/A'}`);
      });
    }

    // تسجيل البحث بالصورة
    if (search_type === 'image' && client_id) {
      await supabase.from('search_logs').insert([{
        client_id: parseInt(client_id),
        lost_date: lost_date,
        results_found: matches.length > 0,
        search_type: 'image'
      }]);
    }

    if (matches.length > 0) {
      res.json({
        success: true,
        found: true,
        matches: matches.slice(0, 5)
      });
    } else {
      res.json({
        success: true,
        found: false,
        message: 'لم يتم العثور على مطابقات'
      });
    }

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'خطأ في البحث' });
  }
});

// جلب سجل بحث العميل
app.get('/api/client/search-history/:client_id', async (req, res) => {
  try {
    const { client_id } = req.params;

    const { data: searchLogs, error } = await supabase
      .from('search_logs')
      .select('*')
      .eq('client_id', client_id)
      .order('search_date', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      searches: searchLogs || []
    });
  } catch (error) {
    console.error('Fetch search history error:', error);
    res.status(500).json({ error: 'خطأ في جلب السجل' });
  }
});

// ========== Start Server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});