// SafeBack v2.0 - Updated with Riyadh Timezone + Headphones + Backpack
// Last Update: 2024-12-29
import React, { useState } from 'react';
import { ArrowRight, Upload, Search, LogIn, Calendar, FolderOpen, Trash2, Image as ImageIcon, FileText } from 'lucide-react';

// Search Options - English
const COLORS = ['All', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Brown', 'Gray', 'Orange', 'Pink', 'Purple', 'Gold', 'Silver', 'Multicolor', 'Not Specified'];
const ITEM_TYPES = ['All', 'Bag', 'Backpack', 'Phone', 'Wallet', 'Keys', 'Glasses', 'Watch', 'Laptop', 'Tablet', 'Camera', 'Headphones', 'Jewelry', 'Passport', 'ID Card', 'Documents', 'Other', 'Not Specified'];
const SIZES = ['All', 'Small', 'Medium', 'Large', 'Not Specified'];

// Mapping for Backend (Arabic)
const COLOR_MAP = {
  'All': 'الكل', 'Black': 'أسود', 'White': 'أبيض', 'Blue': 'أزرق', 'Red': 'أحمر',
  'Green': 'أخضر', 'Yellow': 'أصفر', 'Brown': 'بني', 'Gray': 'رمادي',
  'Orange': 'برتقالي', 'Pink': 'وردي', 'Purple': 'بنفسجي', 'Gold': 'ذهبي', 
  'Silver': 'فضي', 'Multicolor': 'متعدد الألوان', 'Not Specified': 'غير محدد'
};

const TYPE_MAP = {
  'All': 'الكل', 'Bag': 'حقيبة', 'Backpack': 'حقيبة ظهر', 'Phone': 'هاتف', 
  'Wallet': 'محفظة', 'Keys': 'مفاتيح', 'Glasses': 'نظارات', 'Watch': 'ساعة', 
  'Laptop': 'لابتوب', 'Tablet': 'تابلت', 'Camera': 'كاميرا', 
  'Headphones': 'سماعات رأس', 'Jewelry': 'مجوهرات', 'Passport': 'جواز سفر', 
  'ID Card': 'بطاقة هوية', 'Documents': 'مستندات', 'Other': 'أخرى', 
  'Not Specified': 'غير محدد'
};

const SIZE_MAP = {
  'All': 'الكل', 'Small': 'صغير', 'Medium': 'متوسط', 'Large': 'كبير',
  'Not Specified': 'غير محدد'
};

// Reverse mapping for display
const REVERSE_COLOR = Object.fromEntries(Object.entries(COLOR_MAP).map(([k, v]) => [v, k]));
const REVERSE_TYPE = Object.fromEntries(Object.entries(TYPE_MAP).map(([k, v]) => [v, k]));
const REVERSE_SIZE = Object.fromEntries(Object.entries(SIZE_MAP).map(([k, v]) => [v, k]));

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #004D29 0%, #006C35 50%, #00A859 100%)',
    padding: '32px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    border: '1px solid rgba(212,175,55,0.3)',
    maxWidth: '1024px',
    margin: '0 auto'
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '24px',
    color: '#D4AF37',
    marginBottom: '48px',
    textAlign: 'center'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    maxWidth: '768px',
    margin: '0 auto'
  },
  button: {
    padding: '32px',
    borderRadius: '16px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '18px',
    color: 'white',
    textAlign: 'center'
  },
  buttonPrimary: {
    background: 'linear-gradient(to right, #006C35, #00A859)',
  },
  buttonSecondary: {
    background: 'linear-gradient(to right, #D4AF37, #B8941E)',
  },
  buttonBack: {
    background: 'rgba(255,255,255,0.15)',
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(212,175,55,0.3)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    transition: 'all 0.3s'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(212,175,55,0.4)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px',
    outline: 'none'
  },
  select: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid rgba(212,175,55,0.5)',
    background: '#FFFFFF',
    color: '#000000',
    fontSize: '18px',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer'
  },
  label: {
    color: '#D4AF37',
    fontWeight: '600',
    display: 'block',
    marginBottom: '12px',
    fontSize: '18px'
  },
  uploadArea: {
    border: '2px dashed rgba(212,175,55,0.5)',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  spinner: {
    border: '4px solid rgba(212,175,55,0.3)',
    borderTop: '4px solid #D4AF37',
    borderRadius: '50%',
    width: '96px',
    height: '96px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 24px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  th: {
    padding: '16px',
    textAlign: 'center',
    background: 'rgba(0,108,53,0.3)',
    color: '#D4AF37',
    fontWeight: 'bold'
  },
  td: {
    padding: '16px',
    color: 'white',
    borderTop: '1px solid rgba(212,175,55,0.2)',
    textAlign: 'center'
  },
  successBox: {
    background: 'rgba(0,168,89,0.2)',
    border: '2px solid #00A859',
    color: 'white',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '24px'
  },
  errorBox: {
    background: 'rgba(239,68,68,0.2)',
    border: '2px solid #ef4444',
    color: 'white',
    padding: '32px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  badge: {
    background: '#00A859',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '999px',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(8px)'
  },
  modalContent: {
    background: 'linear-gradient(135deg, #004D29 0%, #006C35 100%)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    border: '2px solid #D4AF37',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    animation: 'slideIn 0.3s ease-out'
  },
  modalSuccess: {
    background: 'linear-gradient(135deg, #00A859 0%, #006C35 100%)',
  },
  modalError: {
    background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
  },
  modalTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
    marginTop: '16px'
  },
  modalMessage: {
    fontSize: '18px',
    color: '#D4AF37',
    marginBottom: '24px',
    lineHeight: '1.6'
  },
  modalButton: {
    background: '#D4AF37',
    color: '#004D29',
    padding: '12px 32px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(212,175,55,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    border: '3px solid #D4AF37'
  },
  searchTypeTab: {
    flex: 1,
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid rgba(212,175,55,0.3)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  searchTypeTabActive: {
    background: 'linear-gradient(to right, #D4AF37, #B8941E)',
    border: '2px solid #D4AF37',
    transform: 'scale(1.05)'
  },
  deleteButton: {
    background: 'linear-gradient(to right, #C41E3A, #8B0000)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s'
  }
};

export default function SafeBackApp() {
  const [page, setPage] = useState('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [allItems, setAllItems] = useState([]);

  // Client states
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [showClientRegister, setShowClientRegister] = useState(false);
  const [searchType, setSearchType] = useState('image');
  
  const [clientForm, setClientForm] = useState({
    civilId: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    clientId: null
  });

  const [adminForm, setAdminForm] = useState({
    civilId: '',
    password: '',
    email: '',
    adminId: null
  });

  const [clientImage, setClientImage] = useState(null);
  const [lostDate, setLostDate] = useState('');
  
  const [searchColor, setSearchColor] = useState('All');
  const [searchItemType, setSearchItemType] = useState('All');
  const [searchSize, setSearchSize] = useState('All');
  
  const [foundImage, setFoundImage] = useState(null);
  const [foundDate, setFoundDate] = useState('');

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const NotificationModal = () => {
    if (!notification) return null;

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    const modalStyle = notification.type === 'success' 
      ? {...styles.modalContent, ...styles.modalSuccess}
      : notification.type === 'error'
      ? {...styles.modalContent, ...styles.modalError}
      : styles.modalContent;

    return (
      <div style={styles.modal} onClick={closeNotification}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
          select option {
            background: #FFFFFF;
            color: #000000;
            padding: 15px;
            font-size: 17px;
            font-weight: 700;
          }
          select option:hover {
            background: #F0F0F0;
            color: #000000;
          }
        `}</style>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={styles.iconCircle}>
            <span style={{fontSize: '48px', color: '#D4AF37', fontWeight: 'bold'}}>
              {icons[notification.type]}
            </span>
          </div>
          <h3 style={styles.modalTitle}>{notification.title}</h3>
          <p style={styles.modalMessage}>{notification.message}</p>
          <button 
            onClick={closeNotification}
            style={styles.modalButton}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  const loadAllItems = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:3000/api/admin/items');
      const data = await response.json();
      
      if (data.success) {
        setAllItems(data.items || []);
        if (!data.items || data.items.length === 0) {
          showNotification('info', 'No Items', 'Database is empty. Upload some items first!');
        } else {
          showNotification('success', 'Loaded Successfully', `Found ${data.items.length} items`);
        }
      } else {
        showNotification('error', 'Load Failed', 'Unable to load items');
        setAllItems([]);
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
      setAllItems([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminForm.adminId })
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Deleted', 'Item deleted successfully');
        loadAllItems();
      } else {
        showNotification('error', 'Delete Failed', data.error || 'Unable to delete');
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
    }
  };

  const handleAdminLogin = async () => {
    if (!adminForm.civilId || !adminForm.password) {
      showNotification('error', 'Missing Information', 'Please enter all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          civil_id: adminForm.civilId,
          password: adminForm.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setAdminForm({...adminForm, adminId: data.admin_id});
        showNotification('success', 'Login Successful', 'Welcome back!');
      } else {
        showNotification('error', 'Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
    }
  };

  const handleAdminRegister = async () => {
    if (!adminForm.civilId || !adminForm.password || !adminForm.email) {
      showNotification('error', 'Missing Information', 'Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          civil_id: adminForm.civilId,
          password: adminForm.password,
          email: adminForm.email
        })
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Account Created', 'You can now login');
        setShowRegister(false);
      } else {
        showNotification('error', 'Registration Failed', data.error || 'Unable to create account');
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
    }
  };

  const handleClientLogin = async () => {
    if (!clientForm.civilId || !clientForm.password) {
      showNotification('error', 'Missing Information', 'Please enter all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          civil_id: clientForm.civilId,
          password: clientForm.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsClientLoggedIn(true);
        setClientForm({...clientForm, clientId: data.client_id, fullName: data.full_name});
        showNotification('success', 'Login Successful', `Welcome ${data.full_name}!`);
      } else {
        showNotification('error', 'Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
    }
  };

  const handleClientRegister = async () => {
    if (!clientForm.civilId || !clientForm.password || !clientForm.email || !clientForm.fullName || !clientForm.phone) {
      showNotification('error', 'Missing Information', 'Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          civil_id: clientForm.civilId,
          password: clientForm.password,
          email: clientForm.email,
          full_name: clientForm.fullName,
          phone: clientForm.phone
        })
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Account Created', 'You can now login');
        setShowClientRegister(false);
      } else {
        showNotification('error', 'Registration Failed', data.error || 'Unable to create account');
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
    }
  };

  const handleAdminUpload = async () => {
    if (!foundImage || !foundDate) {
      showNotification('error', 'Missing Information', 'Please select image and date');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', foundImage);
      formData.append('found_date', foundDate);
      formData.append('admin_id', adminForm.adminId);

      const response = await fetch('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const desc = data.description;
        showNotification('success', 'Upload Successful', 
          `AI extracted: ${REVERSE_TYPE[desc.item_type] || 'Unknown'} - ${REVERSE_COLOR[desc.color] || 'Unknown'} - ${REVERSE_SIZE[desc.size] || 'Unknown'}`
        );
        setFoundImage(null);
        setFoundDate('');
        if (showAllItems) {
          loadAllItems();
        }
      } else {
        showNotification('error', 'Upload Failed', data.error || 'Unable to upload');
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClientSearch = async () => {
    if (!lostDate) {
      showNotification('error', 'Missing Information', 'Please select lost date');
      return;
    }

    if (searchType === 'image' && !clientImage) {
      showNotification('error', 'Missing Information', 'Please upload an image');
      return;
    }

    if (searchType === 'description' && searchColor === 'All' && searchItemType === 'All' && searchSize === 'All') {
      showNotification('error', 'Missing Information', 'Please select at least one property');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('lost_date', lostDate);
      formData.append('search_type', searchType);
      
      if (isClientLoggedIn && clientForm.clientId) {
        formData.append('client_id', clientForm.clientId);
      }

      if (searchType === 'image') {
        formData.append('image', clientImage);
      } else {
        const arabicColor = COLOR_MAP[searchColor];
        const arabicType = TYPE_MAP[searchItemType];
        const arabicSize = SIZE_MAP[searchSize];
        
        console.log('📝 Sending description search:', {
          english: { color: searchColor, type: searchItemType, size: searchSize },
          arabic: { color: arabicColor, type: arabicType, size: arabicSize }
        });
        
        formData.append('color', arabicColor);
        formData.append('item_type', arabicType);
        formData.append('size', arabicSize);
      }

      const response = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (data.found) {
          setSearchResults({
            found: true,
            matches: data.matches
          });
        } else {
          setSearchResults({ found: false });
        }
      } else {
        showNotification('error', 'Search Failed', data.error || 'Unable to search');
        setSearchResults({ found: false });
      }
    } catch (error) {
      showNotification('error', 'Connection Error', 'Cannot connect to server');
      setSearchResults({ found: false });
    } finally {
      setIsProcessing(false);
    }
  };

  // Home Page
  if (page === 'home') {
    return (
      <div style={styles.container}>
        <NotificationModal />
        <div style={styles.card}>
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 24px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '4px solid #D4AF37'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#006C35',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                Safe<br/>Back
              </div>
            </div>
            <h1 style={styles.title}>Lost & Found System</h1>
            <p style={styles.subtitle}>Safe Back</p>
          </div>
          
          <div style={styles.buttonGrid}>
            <button
              onClick={() => setPage('client')}
              style={{...styles.button, ...styles.buttonPrimary}}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              <Search style={{margin: '0 auto 12px'}} size={48} />
              <div style={{fontSize: '20px', marginBottom: '8px'}}>Search for Lost Items</div>
              <div style={{fontSize: '14px', opacity: 0.9}}>For Users</div>
            </button>
            
            <button
              onClick={() => setPage('admin')}
              style={{...styles.button, ...styles.buttonSecondary}}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              <LogIn style={{margin: '0 auto 12px'}} size={48} />
              <div style={{fontSize: '20px', marginBottom: '8px'}}>Admin Portal</div>
              <div style={{fontSize: '14px', opacity: 0.9}}>For Staff</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Client Page
  if (page === 'client') {
    return (
      <div style={styles.container}>
        <NotificationModal />
        <div style={{maxWidth: '1024px', margin: '0 auto'}}>
          <button
            onClick={() => {
              setPage('home');
              setSearchResults(null);
              setClientImage(null);
              setIsClientLoggedIn(false);
            }}
            style={styles.buttonBack}
          >
            <ArrowRight size={20} />
            Back
          </button>

          <div style={styles.card}>
            {!isClientLoggedIn ? (
              <>
                <h2 style={{...styles.title, fontSize: '32px'}}>
                  {showClientRegister ? 'Create Account' : 'Client Login'}
                </h2>

                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  <div>
                    <label style={styles.label}>Civil ID</label>
                    <input
                      type="text"
                      value={clientForm.civilId}
                      onChange={(e) => setClientForm({...clientForm, civilId: e.target.value})}
                      style={styles.input}
                      placeholder="Enter Civil ID"
                    />
                  </div>

                  {showClientRegister && (
                    <>
                      <div>
                        <label style={styles.label}>Full Name</label>
                        <input
                          type="text"
                          value={clientForm.fullName}
                          onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                          style={styles.input}
                          placeholder="Enter Full Name"
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Email</label>
                        <input
                          type="email"
                          value={clientForm.email}
                          onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                          style={styles.input}
                          placeholder="Enter Email"
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Phone</label>
                        <input
                          type="tel"
                          value={clientForm.phone}
                          onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                          style={styles.input}
                          placeholder="Enter Phone Number"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label style={styles.label}>Password</label>
                    <input
                      type="password"
                      value={clientForm.password}
                      onChange={(e) => setClientForm({...clientForm, password: e.target.value})}
                      style={styles.input}
                      placeholder="Enter Password"
                    />
                  </div>

                  <button
                    onClick={showClientRegister ? handleClientRegister : handleClientLogin}
                    style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}
                  >
                    {showClientRegister ? 'Create Account' : 'Login'}
                  </button>

                  <button
                    onClick={() => setShowClientRegister(!showClientRegister)}
                    style={{background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', textAlign: 'center', padding: '8px', textDecoration: 'underline'}}
                  >
                    {showClientRegister ? 'Already have account? Login' : 'No account? Register'}
                  </button>

                  <div style={{textAlign: 'center', marginTop: '16px'}}>
                    <button
                      onClick={() => {
                        setIsClientLoggedIn(true);
                        showNotification('info', 'Guest Mode', 'Searching as guest');
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        color: '#D4AF37',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {clientForm.clientId && (
                  <div style={{...styles.successBox, marginBottom: '24px'}}>
                    <p style={{fontSize: '18px', fontWeight: 'bold', margin: 0}}>
                      Welcome, {clientForm.fullName}! 👋
                    </p>
                  </div>
                )}

                <h2 style={{...styles.title, fontSize: '32px'}}>Search for Lost Items</h2>
                
                {!isProcessing && !searchResults && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    {/* اختيار نوع البحث */}
                    <div>
                      <label style={styles.label}>Search Method</label>
                      <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                        <div
                          onClick={() => setSearchType('image')}
                          style={{
                            ...styles.searchTypeTab,
                            ...(searchType === 'image' ? styles.searchTypeTabActive : {})
                          }}
                        >
                          <ImageIcon size={32} />
                          <span>By Image</span>
                        </div>
                        <div
                          onClick={() => setSearchType('description')}
                          style={{
                            ...styles.searchTypeTab,
                            ...(searchType === 'description' ? styles.searchTypeTabActive : {})
                          }}
                        >
                          <FileText size={32} />
                          <span>By Description</span>
                        </div>
                      </div>
                    </div>

                    {/* حقول البحث */}
                    {searchType === 'image' ? (
                      <div>
                        <label style={styles.label}>Upload Item Image</label>
                        <div style={styles.uploadArea}>
                          <Upload style={{margin: '0 auto 12px', color: '#D4AF37'}} size={48} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setClientImage(e.target.files[0])}
                            style={{display: 'none'}}
                            id="client-upload"
                          />
                          <label htmlFor="client-upload" style={{cursor: 'pointer', color: 'white', fontSize: '18px'}}>
                            {clientImage ? clientImage.name : 'Click to upload image'}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        <div>
                          <label style={styles.label}>Color</label>
                          <select 
                            value={searchColor} 
                            onChange={(e) => setSearchColor(e.target.value)}
                            style={styles.select}
                          >
                            {COLORS.map(color => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={styles.label}>Type</label>
                          <select 
                            value={searchItemType} 
                            onChange={(e) => setSearchItemType(e.target.value)}
                            style={styles.select}
                          >
                            {ITEM_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={styles.label}>Size</label>
                          <select 
                            value={searchSize} 
                            onChange={(e) => setSearchSize(e.target.value)}
                            style={styles.select}
                          >
                            {SIZES.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={styles.label}>Lost Date</label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(212,175,55,0.3)'}}>
                        <Calendar style={{color: '#D4AF37'}} size={24} />
                        <input
                          type="date"
                          value={lostDate}
                          onChange={(e) => setLostDate(e.target.value)}
                          style={{...styles.input, border: 'none', padding: 0}}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleClientSearch}
                      style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}
                    >
                      Search
                    </button>

                    {clientForm.clientId && (
                      <button
                        onClick={() => {
                          setIsClientLoggedIn(false);
                          setClientForm({civilId: '', password: '', email: '', fullName: '', phone: '', clientId: null});
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          color: '#D4AF37',
                          padding: '12px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                )}

                {isProcessing && (
                  <div style={{textAlign: 'center', padding: '48px 0'}}>
                    <div style={styles.spinner}></div>
                    <p style={{color: 'white', fontSize: '24px', fontWeight: 'bold'}}>Searching...</p>
                    <p style={{color: '#D4AF37', marginTop: '8px'}}>Please wait</p>
                  </div>
                )}

                {searchResults && searchResults.found && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div style={styles.successBox}>
                      <p style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>Matches Found!</p>
                    </div>

                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Image</th>
                          <th style={styles.th}>Date Found</th>
                          {searchType === 'description' && <th style={styles.th}>Description</th>}
                          <th style={styles.th}>Match %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.matches.map((match, i) => (
                          <tr key={i}>
                            <td style={styles.td}>
                              <img src={match.image_url} alt="Lost Item" 
                                style={{width: '96px', height: '96px', objectFit: 'cover', 
                                        borderRadius: '8px', border: '2px solid rgba(212,175,55,0.3)', 
                                        margin: '0 auto', display: 'block'}} />
                            </td>
                            <td style={styles.td}>{match.found_date}</td>
                            {searchType === 'description' && (
                              <td style={styles.td}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px'}}>
                                  <span>🎨 {REVERSE_COLOR[match.color] || '-'}</span>
                                  <span>📦 {REVERSE_TYPE[match.item_type] || '-'}</span>
                                  <span>📏 {REVERSE_SIZE[match.size] || '-'}</span>
                                </div>
                              </td>
                            )}
                            <td style={styles.td}>
                              <span style={styles.badge}>{match.similarity}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{...styles.successBox, background: 'rgba(212,175,55,0.2)', borderColor: '#D4AF37'}}>
                      <p style={{fontSize: '20px', fontWeight: 'bold'}}>Please Contact Management</p>
                    </div>

                    <button
                      onClick={() => {
                        setSearchResults(null);
                        setClientImage(null);
                        setLostDate('');
                        setSearchColor('All');
                        setSearchItemType('All');
                        setSearchSize('All');
                      }}
                      style={styles.buttonBack}
                    >
                      New Search
                    </button>
                  </div>
                )}

                {searchResults && !searchResults.found && (
                  <div style={{textAlign: 'center', padding: '48px 0'}}>
                    <div style={styles.errorBox}>
                      <p style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>Sorry</p>
                      <p style={{fontSize: '20px'}}>No matches found</p>
                    </div>

                    <button
                      onClick={() => {
                        setSearchResults(null);
                        setClientImage(null);
                        setLostDate('');
                        setSearchColor('All');
                        setSearchItemType('All');
                        setSearchSize('All');
                      }}
                      style={{...styles.buttonBack, margin: '24px auto 0'}}
                    >
                      New Search
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin Page
  if (page === 'admin') {
    return (
      <div style={styles.container}>
        <NotificationModal />
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <button
            onClick={() => {
              setPage('home');
              setIsLoggedIn(false);
              setShowAllItems(false);
            }}
            style={styles.buttonBack}
          >
            <ArrowRight size={20} />
            Back
          </button>

          <div style={styles.card}>
            {!isLoggedIn ? (
              <>
                <h2 style={{...styles.title, fontSize: '32px'}}>
                  {showRegister ? 'Create Admin Account' : 'Admin Login'}
                </h2>

                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  <div>
                    <label style={styles.label}>Civil ID</label>
                    <input
                      type="text"
                      value={adminForm.civilId}
                      onChange={(e) => setAdminForm({...adminForm, civilId: e.target.value})}
                      style={styles.input}
                      placeholder="Enter Civil ID"
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Password</label>
                    <input
                      type="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                      style={styles.input}
                      placeholder="Enter Password"
                    />
                  </div>

                  {showRegister && (
                    <div>
                      <label style={styles.label}>Email</label>
                      <input
                        type="email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                        style={styles.input}
                        placeholder="Enter Email"
                      />
                    </div>
                  )}

                  <button
                    onClick={showRegister ? handleAdminRegister : handleAdminLogin}
                    style={{...styles.button, ...styles.buttonSecondary, width: '100%'}}
                  >
                    {showRegister ? 'Create Account' : 'Login'}
                  </button>

                  <button
                    onClick={() => setShowRegister(!showRegister)}
                    style={{background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', textAlign: 'center', padding: '8px', textDecoration: 'underline'}}
                  >
                    {showRegister ? 'Already have account? Login' : 'No account? Register'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                  <h2 style={{...styles.title, fontSize: '32px', margin: 0, textAlign: 'left'}}>
                    {showAllItems ? 'All Saved Items' : 'Upload Found Items'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAllItems(!showAllItems);
                      if (!showAllItems) {
                        loadAllItems();
                      }
                    }}
                    style={{
                      ...styles.button,
                      ...styles.buttonSecondary,
                      padding: '12px 24px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FolderOpen size={20} />
                    {showAllItems ? 'Upload New' : 'View All'}
                  </button>
                </div>

                {isProcessing && (
                  <div style={{textAlign: 'center', padding: '48px 0'}}>
                    <div style={styles.spinner}></div>
                    <p style={{color: 'white', fontSize: '24px', fontWeight: 'bold'}}>Loading...</p>
                  </div>
                )}

                {!isProcessing && !showAllItems && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div>
                      <label style={styles.label}>Item Image</label>
                      <div style={styles.uploadArea}>
                        <Upload style={{margin: '0 auto 12px', color: '#D4AF37'}} size={48} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFoundImage(e.target.files[0])}
                          style={{display: 'none'}}
                          id="admin-upload"
                        />
                        <label htmlFor="admin-upload" style={{cursor: 'pointer', color: 'white', fontSize: '18px'}}>
                          {foundImage ? foundImage.name : 'Click to upload image'}
                        </label>
                      </div>
                      <p style={{color: '#D4AF37', fontSize: '14px', marginTop: '8px', textAlign: 'center'}}>
                        💡 AI will automatically extract description (color, type, size)
                      </p>
                    </div>

                    <div>
                      <label style={styles.label}>Found Date</label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(212,175,55,0.3)'}}>
                        <Calendar style={{color: '#D4AF37'}} size={24} />
                        <input
                          type="date"
                          value={foundDate}
                          onChange={(e) => setFoundDate(e.target.value)}
                          style={{...styles.input, border: 'none', padding: 0}}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAdminUpload}
                      style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}
                    >
                      Upload
                    </button>
                  </div>
                )}

                {!isProcessing && showAllItems && (
                  <div>
                    <div style={{marginBottom: '24px', padding: '16px', background: 'rgba(212,175,55,0.15)', borderRadius: '12px', border: '2px solid rgba(212,175,55,0.4)', textAlign: 'center'}}>
                      <p style={{color: '#D4AF37', fontSize: '18px', fontWeight: 'bold', margin: 0}}>
                        📊 Total Items: {allItems.length}
                      </p>
                    </div>

                    {allItems.length === 0 ? (
                      <div style={{textAlign: 'center', padding: '64px', color: '#D4AF37'}}>
                        <FolderOpen size={80} style={{margin: '0 auto 24px', opacity: 0.3}} />
                        <p style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>No Items</p>
                        <p style={{fontSize: '16px', opacity: 0.7}}>Upload some items first</p>
                      </div>
                    ) : (
                      <div style={{overflowX: 'auto'}}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={{...styles.th, width: '80px'}}>#</th>
                              <th style={{...styles.th, width: '180px'}}>Image</th>
                              <th style={styles.th}>Found Date</th>
                              <th style={styles.th}>Description</th>
                              <th style={styles.th}>Upload Date</th>
                              <th style={{...styles.th, width: '150px'}}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allItems.map((item, index) => (
                              <tr key={item.id} style={{
                                background: index % 2 === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.05)'
                              }}>
                                <td style={styles.td}>
                                  <div style={{
                                    background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
                                    color: '#004D29',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    fontWeight: 'bold',
                                    fontSize: '18px'
                                  }}>
                                    {index + 1}
                                  </div>
                                </td>
                                <td style={styles.td}>
                                  <img 
                                    src={item.image_url} 
                                    alt={`Item ${index + 1}`}
                                    style={{
                                      width: '140px',
                                      height: '140px',
                                      objectFit: 'cover',
                                      borderRadius: '12px',
                                      border: '3px solid rgba(212,175,55,0.5)',
                                      margin: '8px auto',
                                      display: 'block'
                                    }}
                                  />
                                </td>
                                <td style={styles.td}>
                                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                                    <Calendar size={24} style={{color: '#D4AF37'}} />
                                    <span style={{fontSize: '16px', fontWeight: 'bold', color: '#D4AF37'}}>
                                      {item.found_date}
                                    </span>
                                  </div>
                                </td>
                                <td style={styles.td}>
                                  <div style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px'}}>
                                    <span>🎨 {REVERSE_COLOR[item.color] || '-'}</span>
                                    <span>📦 {REVERSE_TYPE[item.item_type] || '-'}</span>
                                    <span>📏 {REVERSE_SIZE[item.size] || '-'}</span>
                                  </div>
                                </td>
                                <td style={styles.td}>
                                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                                    <Upload size={20} style={{color: '#00A859'}} />
                                    <span style={{fontSize: '15px', fontWeight: '600'}}>
                                      {(() => {
                                        const date = new Date(item.created_at);
                                        // إضافة 3 ساعات للتوقيت السعودي
                                        date.setHours(date.getHours() + 3);
                                        return date.toLocaleDateString('en-US');
                                      })()}
                                    </span>
                                    <span style={{fontSize: '13px', opacity: 0.7}}>
                                      {(() => {
                                        const date = new Date(item.created_at);
                                        // إضافة 3 ساعات للتوقيت السعودي
                                        date.setHours(date.getHours() + 3);
                                        return date.toLocaleTimeString('en-US', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        });
                                      })()}
                                    </span>
                                  </div>
                                </td>
                                <td style={styles.td}>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    style={{
                                      ...styles.deleteButton,
                                      padding: '12px 20px',
                                      fontSize: '15px'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                  >
                                    <Trash2 size={18} />
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}