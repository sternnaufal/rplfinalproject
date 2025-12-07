# **Pasti Sehat Pharmacy - Inventory Management System**

## **Overview**
A comprehensive web-based inventory management system designed for **Apotek Pasti Sehat** to efficiently manage medicine and supplement stock, transactions, and reporting. The system automates critical pharmacy operations while ensuring data accuracy and regulatory compliance.

---

## **Features**

### **📦 Core Inventory Management**
- **REQ-001** Add new drug data (name, ID, quantity, price, expiration date, supplier, storage type)
- **REQ-002** Edit/update existing drug information
- **REQ-003** Delete drug records (with confirmation safeguards)
- **REQ-020** Categorize drugs by type (tablets, capsules, vaccines, supplements, etc.)

### **🔄 Transaction Processing**
- **REQ-004** Record incoming stock (purchases/distributor deliveries)
- **REQ-005** Record outgoing stock (sales/pharmacy withdrawals)
- **REQ-006** Automatic stock updates after each transaction
- **REQ-016** Integration with cashier/sales system for real-time updates

### **📊 Monitoring & Alerts**
- **REQ-008** Highlight medicines nearing expiration (configurable threshold)
- **REQ-009** Low stock notifications based on minimum quantity levels
- **REQ-010** Expired medicine alerts
- **REQ-019** Repeat low stock alerts for urgent attention
- **REQ-022** Send alerts via WhatsApp to pharmacists/admins

### **📈 Reporting & Analytics**
- **REQ-007** Check daily/monthly stock levels
- **REQ-011** Generate medicine stock reports
- **REQ-012** View expired medicine reports
- **REQ-013** Print reports directly from the system
- **REQ-021** Export data to Excel/PDF formats

### **🔍 Search & Filter**
- **REQ-018** Quick medicine search by name, ID, or category
- **REQ-018** Advanced filtering by expiration date, stock level, supplier, etc.

### **🔐 Security & Administration**
- **REQ-014** Individual login with username/password
- **REQ-015** Role-based access control:
  - **Pharmacist (Superadmin):** Full system access
  - **Admin:** Inventory management without critical deletions
- **REQ-017** Automatic data backup to prevent data loss

---

## **Technology Stack**
- **Frontend:** React.js / Vue.js with responsive UI design
- **Backend:** Node.js (Express) or Python (Django/Flask)
- **Database:** PostgreSQL / MySQL with proper indexing
- **Real-time Alerts:** WhatsApp Business API / Twilio
- **Reporting:** Chart.js for analytics, PDF/Excel export libraries
- **Backup:** Automated cloud/local backup system

---

## **System Requirements**
- Modern web browser (Chrome, Firefox, Edge)
- Internet connection for WhatsApp notifications
- Recommended: 4GB RAM, 2GHz processor
- Database server with daily backup capability

---

## **Installation & Setup**

### **Prerequisites**
- Node.js/Python runtime environment
- Database server (PostgreSQL/MySQL)
- WhatsApp Business Account (for alerts)

### **Setup Steps**
1. Clone the repository
   ```
   git clone https://github.com/pastisehat/inventory-system.git
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Configure environment variables
   ```env
   DB_HOST=localhost
   DB_NAME=pastisehat_inventory
   DB_USER=your_username
   DB_PASS=your_password
   WHATSAPP_API_KEY=your_api_key
   ```
4. Initialize database
   ```
   npm run db:migrate
   ```
5. Start the application
   ```
   npm start
   ```

---

## **Usage Guide**

### **For Pharmacists (Superadmin)**
1. Log in with superadmin credentials
2. Add new medicines with complete details
3. Review expiration and low stock alerts
4. Generate monthly reports
5. Manage user accounts and permissions

### **For Administrators**
1. Log in with admin credentials
2. Record incoming/outgoing stock
3. Update medicine information
4. View stock levels and alerts
5. Export transaction data

### **Daily Operations**
- Morning: Check overnight alerts (WhatsApp/email)
- Day: Process transactions, update stock
- Evening: Review daily reports, backup data

---

## **Alert Thresholds (Configurable)**
- **Low Stock:** Below 20% of maximum capacity
- **Expiring Soon:** 30 days before expiration date
- **Critical Alert:** Below 10% stock or 7 days to expiration

---

## **Data Backup Strategy**
- **Automatic:** Daily incremental backups at 2:00 AM
- **Manual:** On-demand backup before major operations
- **Retention:** 30 days of daily backups, 12 months of monthly archives

---

## **Integration Points**
1. **Cashier System:** Real-time API for sales data
2. **Supplier Database:** Auto-fill supplier information
3. **WhatsApp API:** Direct alert delivery
4. **Print Service:** Thermal printer support for labels/reports

---

## **Security Features**
- Encrypted password storage (bcrypt)
- HTTPS enforced for all communications
- Session timeout after 30 minutes inactivity
- Audit logs for all critical operations
- SQL injection prevention
- XSS protection

---

## **Support & Maintenance**
- **Regular Updates:** Security patches every month
- **Backup Verification:** Weekly test restoration
- **Performance Monitoring:** 24/7 system health checks
- **User Training:** Available for pharmacy staff

---

## **License & Compliance**
- Proprietary software for Apotek Pasti Sehat
- Compliant with Indonesian pharmacy regulations
- Data privacy compliant (PDPA/PIPL)

---

## **Contact & Support**
- **System Administrator:** admin@pastisehat.com
- **Technical Support:** tech@pastisehat.com
- **Emergency:** +62-XXX-XXXX-XXXX (Pharmacy Manager)

---

*Last Updated: October 2023*  
*Version: 1.0.0*  
*Developed for Apotek Pasti Sehat - Ensuring Healthy Inventory Management*
