const fs = require('fs');
const path = require('path');

function checkAndCreate(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['.git', 'node_modules', '.vitepress'].includes(file.name)) {
      checkAndCreate(fullPath);
    } else if (file.isFile() && fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      // Replace <image.png> with image.png in Markdown
      content = content.replace(/!\[(.*?)\]\(<([^/.]+[^/:]*?)>\)/g, '![$1](./$2)');
      
      // Fix: Don't replace if it already starts with ./ or http
      // Also be careful with parenthesis in filenames like IMG_2261(1).JPG
      content = content.replace(/!\[(.*?)\]\((?!http|\.\/|\/)((?:[^()]+|\([^)]*\))+)\)/g, '![$1](./$2)');
      content = content.replace(/<img(.*?)src="(?!http|\.\/|\/)(.*?)"(.*?)>/g, '<img$1src="./$2"$3>');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
      }
      const imgRegex = /!\[.*?\]\((?!http)((?:[^()]+|\([^)]*\))+)\)|<img.*?src="(?!http)(.*?)".*?>/g;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        let imgPath = match[1] || match[2];
        if (imgPath) {
          // 提取路径部分，忽略 URL 参数或 hash
          imgPath = imgPath.split('?')[0].split('#')[0];
          imgPath = decodeURIComponent(imgPath);
          const absImgPath = path.resolve(dir, imgPath);
          if (!fs.existsSync(absImgPath)) {
            console.log('Missing image:', absImgPath, 'in', fullPath);
            // Create a dummy image or empty file
            // Let's create a 1x1 transparent PNG or just an empty file
            // Vite can handle empty files for images, it just warns or fails?
            // Let's create an empty file, actually Vite might complain about invalid image.
            // Let's create a dummy valid PNG.
            const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
            const targetDir = path.dirname(absImgPath);
            try {
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              fs.writeFileSync(absImgPath, dummyPng);
            } catch (e) {
              console.log('Cannot create dummy file for:', absImgPath, e.message);
            }
          }
        }
      }
    }
  }
}

checkAndCreate(__dirname);
