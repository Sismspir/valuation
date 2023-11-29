import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),

    // vitePluginPacker({
    //   include: /\.xls$/,
    //   transformer: (code, id) => {
    //     // Here, you'd convert the XLS content to a format that can be used in your app
    //     // You might use a library like 'xlsx' to read and process the XLS file content
    //     // For example:
    //     // const workbook = XLSX.readFile(id);
    //     // const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    //     // return `export default ${JSON.stringify(jsonData)};`;
    //     // This is a basic example and might need adjustments based on your specific use case
    //   },
    // })
  
  ],
})
