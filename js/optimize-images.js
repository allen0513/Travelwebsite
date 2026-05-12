const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const config = {
  inputDir: './image',
  outputDir: './image/optimized',
  quality: 85,
  maxWidth: 1920,
  generateResponsive: true,
  generateWebP: true,
  formats: ['jpg', 'jpeg', 'png', 'gif'],
  sizes: [480, 768, 1024, 1920],    

/**
 * 检查依赖是否安�? */
function checkDependencies() {
  console.log('🔍 检查依赖包...');

  try {
    require('sharp');
    console.log('�?Sharp 已安�?);
  } catch (e) {
    console.log('�?缺少 Sharp 依赖');
    console.log('请运�? npm install sharp');
    process.exit(1);
  }

  try {
    require('glob');
    console.log('�?Glob 已安�?);
  } catch (e) {
    console.log('�?缺少 Glob 依赖');
    console.log('请运�? npm install glob');
    process.exit(1);
  }
}

/**
 * 创建输出目录
 */
function createOutputDir() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log(`📁 创建输出目录: ${config.outputDir}`);
  }
}

/**
 * 获取所有图片文�? */
function getImageFiles() {
  const glob = require('glob');
  const pattern = `${config.inputDir}/**/*.{${config.formats.join(',')}}`;
  return glob.sync(pattern);
}

/**
 * 压缩单张图片
 */
async function compressImage(inputPath, outputPath) {
  const sharp = require('sharp');

  try {
    await sharp(inputPath)
      .resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: config.quality })
      .toFile(outputPath);

    const stats = fs.statSync(inputPath);
    const compressedStats = fs.statSync(outputPath);
    const savings = ((stats.size - compressedStats.size) / stats.size * 100).toFixed(1);

    console.log(`�?压缩完成: ${path.basename(inputPath)} (${savings}% 节省)`);
  } catch (error) {
    console.error(`�?压缩失败: ${path.basename(inputPath)} - ${error.message}`);
  }
}

/**
 * 生成WebP格式
 */
async function generateWebP(inputPath, outputPath) {
  const sharp = require('sharp');

  try {
    const webpPath = outputPath.replace(/\.[^.]+$/, '.webp');
    await sharp(inputPath)
      .webp({ quality: config.quality })
      .toFile(webpPath);

    console.log(`🎨 WebP生成: ${path.basename(webpPath)}`);
  } catch (error) {
    console.error(`�?WebP生成失败: ${path.basename(inputPath)} - ${error.message}`);
  }
}

/**
 * 生成响应式图�? */
async function generateResponsiveImages(inputPath, outputPath) {
  const sharp = require('sharp');

  const filename = path.basename(inputPath, path.extname(inputPath));

  for (const size of config.sizes) {
    try {
      const responsivePath = path.join(
        path.dirname(outputPath),
        `${filename}-${size}w${path.extname(outputPath)}`
      );

      await sharp(inputPath)
        .resize(size, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: config.quality })
        .toFile(responsivePath);

      console.log(`📱 响应式图�? ${path.basename(responsivePath)}`);
    } catch (error) {
      console.error(`�?响应式图片生成失�? ${filename}-${size}w - ${error.message}`);
    }
  }
}

/**
 * 生成HTML srcset属�? */
function generateSrcsetHtml(filename, sizes) {
  const baseName = path.basename(filename, path.extname(filename));
  const srcset = sizes.map(size => `${baseName}-${size}w.jpg ${size}w`).join(', ');
  return `srcset="${srcset}"`;
}

/**
 * 主函�? */
async function main() {
  console.log('🚀 开始优化浙里风光网站图�?..\n');

  // 检查依赖
  checkDependencies();
  console.log('');

  // 创建输出目录
  createOutputDir();

  // 获取图片文件
  const imageFiles = getImageFiles();
  console.log(`📂 找到 ${imageFiles.length} 张图片文件\n`);

  if (imageFiles.length === 0) {
    console.log('没有找到图片文件，请检�?image/ 目录是否存在�?);
    return;
  }

  let processedCount = 0;
  let errorCount = 0;

  // 处理每张图片
  for (const inputPath of imageFiles) {
    const relativePath = path.relative(config.inputDir, inputPath);
    const outputPath = path.join(config.outputDir, relativePath);

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      // 压缩图片
      await compressImage(inputPath, outputPath);

      // 生成WebP
      if (config.generateWebP) {
        await generateWebP(inputPath, outputPath);
      }

      // 生成响应式图�?      if (config.generateResponsive) {
        await generateResponsiveImages(inputPath, outputPath);
      }

      processedCount++;
    } catch (error) {
      console.error(`�?处理失败: ${path.basename(inputPath)} - ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n🎉 图片优化完成�?);
  console.log(`📊 处理结果: ${processedCount} 成功, ${errorCount} 失败`);

  console.log('\n📋 使用建议:');
  console.log('1. �?optimized/ 目录中的图片替换�?image/ 目录');
  console.log('2. 使用响应式图片语�?');
  console.log(`
<picture>
  <source srcset="image/photo.webp" type="image/webp">
  <img src="image/photo.jpg"
       srcset="${generateSrcsetHtml('image/photo.jpg', config.sizes)}"
       sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024w, 1920px"
       alt="浙里美景">
</picture>
  `);
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { config, generateSrcsetHtml };