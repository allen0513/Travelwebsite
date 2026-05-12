// 浙里风光网站图片优化脚本
// 图片懒加载和优化功能

// 图片懒加载类
class LazyImageLoader {
    constructor() {
        this.images = [];
        this.init();
    }

    init() {
        this.observeImages();
        this.setupWebP();
    }

    // 观察所有需要懒加载的图片
    observeImages() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // 查找所有需要懒加载的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 加载图片
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // 创建新图片对象来预加载
        const newImg = new Image();
        newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        newImg.src = src;
    }

    // WebP格式支持检测和处理
    setupWebP() {
        // 检测浏览器是否支持WebP
        const webpSupport = this.checkWebPSupport();

        if (webpSupport) {
            this.convertImagesToWebP();
        }
    }

    // 检测WebP支持
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;

        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // 转换图片为WebP格式（如果适用）
    convertImagesToWebP() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 对于banner图片，可以提供WebP版本
            if (img.src.includes('banner') || img.src.includes('topb4')) {
                const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                // 这里可以添加实际的WebP转换逻辑
                // 暂时只记录支持情况
                img.setAttribute('data-webp-support', 'true');
            }
        });
    }
}

// 图片预加载类
class ImagePreloader {
    constructor() {
        this.preloadQueue = [];
        this.loadedImages = new Set();
    }

    // 预加载重要图片
    preloadCriticalImages() {
        const criticalImages = [
            'image/logo.png',
            'image/topb4 (1).jpg',
            'image/banner2.jpg',
            'image/spring_img.png',
            'image/summer_img.png'
        ];

        criticalImages.forEach(src => {
            if (!this.loadedImages.has(src)) {
                this.preloadImage(src);
            }
        });
    }

    // 预加载单张图片
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loadedImages.add(src);
                resolve(src);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
}

// 响应式图片处理
class ResponsiveImageHandler {
    constructor() {
        this.init();
    }

    init() {
        this.handleResponsiveImages();
        this.setupImageOptimization();
    }

    // 处理响应式图片
    handleResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 添加loading="lazy"属性（如果浏览器支持）
            if ('loading' in HTMLImageElement.prototype) {
                img.setAttribute('loading', 'lazy');
            }

            // 添加alt属性（如果缺失）
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '浙里风光旅游图片');
            }
        });
    }

    // 设置图片优化
    setupImageOptimization() {
        // 监听页面可见性变化，暂停/恢复图片加载
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面不可见时暂停加载
                this.pauseImageLoading();
            } else {
                // 页面可见时恢复加载
                this.resumeImageLoading();
            }
        });

        // 监听网络状态变化
        if ('connection' in navigator) {
            const connection = navigator.connection;
            connection.addEventListener('change', () => {
                this.adjustImageQuality(connection.effectiveType);
            });
        }
    }

    // 根据网络状况调整图片质量
    adjustImageQuality(connectionType) {
        const images = document.querySelectorAll('img[data-src]');
        const quality = this.getQualityForConnection(connectionType);

        images.forEach(img => {
            let src = img.getAttribute('data-src');
            if (src) {
                // 根据网络质量调整图片尺寸
                src = this.adjustImageUrl(src, quality);
                img.setAttribute('data-src', src);
            }
        });
    }

    // 根据网络类型获取质量设置
    getQualityForConnection(connectionType) {
        switch (connectionType) {
            case '4g':
                return 'high';
            case '3g':
                return 'medium';
            case '2g':
            case 'slow-2g':
                return 'low';
            default:
                return 'high';
        }
    }

    // 调整图片URL以适应质量需求
    adjustImageUrl(url, quality) {
        // 这里可以实现具体的图片质量调整逻辑
        // 例如添加查询参数来请求不同尺寸的图片
        const qualityParams = {
            high: 'w=1200',
            medium: 'w=800',
            low: 'w=400'
        };

        if (url.includes('?')) {
            return url + '&' + qualityParams[quality];
        } else {
            return url + '?' + qualityParams[quality];
        }
    }

    // 暂停图片加载
    pauseImageLoading() {
        // 可以实现暂停懒加载的逻辑
        console.log('图片加载已暂停');
    }

    // 恢复图片加载
    resumeImageLoading() {
        // 可以实现恢复懒加载的逻辑
        console.log('图片加载已恢复');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化图片优化功能
    const lazyLoader = new LazyImageLoader();
    const preloader = new ImagePreloader();
    const responsiveHandler = new ResponsiveImageHandler();

    // 预加载关键图片
    preloader.preloadCriticalImages();

    // 添加图片优化相关的CSS
    const style = document.createElement('style');
    style.textContent = `
        /* 图片优化样式 */
        img {
            transition: opacity 0.3s ease;
        }

        img.loaded {
            opacity: 1;
        }

        img:not(.loaded) {
            opacity: 0;
        }

        /* 为不支持懒加载的浏览器提供回退 */
        img[data-src] {
            opacity: 0;
        }

        /* 图片加载占位符 */
        .image-placeholder {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }
    `;
    document.head.appendChild(style);
});
