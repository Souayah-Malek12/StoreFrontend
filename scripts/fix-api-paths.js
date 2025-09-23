const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'src');

const filesToUpdate = [
  'pages/ProdByCat.jsx',
  'pages/CartPage.jsx',
  'pages/ProductDetails.jsx',
  'pages/admin/AdmOrders.jsx',
  'pages/admin/UpdateProduct.jsx',
  'pages/admin/Products.jsx',
  'pages/admin/AdminDashboard.jsx',
  'components/Form/SearchInpput.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(frontendDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the API paths by removing the duplicate /api/v1
    const updatedContent = content
      .replace(/\$\{import\.meta\.env\.VITE_APP_API\}\/api\/v1\/product/g, '${import.meta.env.VITE_APP_API}/product')
      .replace(/\$\{import\.meta\.env\.VITE_APP_API\}\/api\/v1\/category/g, '${import.meta.env.VITE_APP_API}/category')
      .replace(/\$\{import\.meta\.env\.VITE_APP_API\}\/api\/v1\/orders/g, '${import.meta.env.VITE_APP_API}/orders');
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`Skipped (not found): ${file}`);
  }
});

console.log('API path updates complete!');
