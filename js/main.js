// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加平滑滚动效果
    setupSmoothScroll();

    // 添加动画效果
    setupAnimations();

    // 添加本地存储功能
    setupLocalStorage();

    // 添加导航功能
    setupNavigation();
});

// 平滑滚动功能
function setupSmoothScroll() {
    // 获取所有内部链接
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 动画效果
function setupAnimations() {
    // 为计划卡片添加进入动画
    const planCards = document.querySelectorAll('.plan-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    planCards.forEach((card, index) => {
        // 初始状态
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        // 观察元素
        observer.observe(card);
    });

    // 为内容区域添加渐入效果
    const sections = document.querySelectorAll('.plan-details section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sectionObserver.observe(section);
    });
}

// 本地存储功能
function setupLocalStorage() {
    // 存储用户的训练进度
    storeTrainingProgress();

    // 存储用户的偏好设置
    storeUserPreferences();
}

function storeTrainingProgress() {
    // 获取所有计划链接
    const planLinks = document.querySelectorAll('.plan-card .btn');

    planLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 记录用户点击的计划
            const planName = this.parentElement.querySelector('h2').textContent;
            const clickTime = new Date().toISOString();

            // 存储到本地存储
            let trainingHistory = JSON.parse(localStorage.getItem('trainingHistory') || '[]');
            trainingHistory.push({
                plan: planName,
                timestamp: clickTime
            });

            // 只保留最近50条记录
            if (trainingHistory.length > 50) {
                trainingHistory = trainingHistory.slice(-50);
            }

            localStorage.setItem('trainingHistory', JSON.stringify(trainingHistory));
        });
    });
}

function storeUserPreferences() {
    // 检测用户的主题偏好
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme) {
        localStorage.setItem('themePreference', 'dark');
    } else {
        localStorage.setItem('themePreference', 'light');
    }

    // 监听主题变化
    prefersDarkScheme.addListener((e) => {
        localStorage.setItem('themePreference', e.matches ? 'dark' : 'light');
    });
}

// 导航功能
function setupNavigation() {
    // 添加键盘导航支持
    setupKeyboardNavigation();

    // 添加面包屑导航
    setupBreadcrumbNavigation();
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC键返回主页
        if (e.key === 'Escape') {
            const currentPage = window.location.pathname;
            if (currentPage !== '/' && currentPage !== '/index.html') {
                window.location.href = '../index.html';
            }
        }

        // Alt + H 返回主页
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = '../index.html';
        }
    });
}

function setupBreadcrumbNavigation() {
    // 在详情页面添加面包屑导航
    const header = document.querySelector('header');
    if (header && !document.querySelector('.breadcrumb')) {
        const nav = header.querySelector('nav');
        if (nav) {
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'breadcrumb';
            breadcrumb.innerHTML = `
                <a href="../index.html">首页</a>
                <span class="separator"> / </span>
                <span class="current">训练计划</span>
            `;
            breadcrumb.style.cssText = `
                margin-bottom: 20px;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
            `;

            nav.insertAdjacentElement('afterend', breadcrumb);
        }
    }
}

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面性能优化
function optimizePagePerformance() {
    // 延迟加载图片（如果有的话）
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 预加载关键资源
    preloadCriticalResources();
}

function preloadCriticalResources() {
    // 预加载CSS文件
    const cssLink = document.createElement('link');
    cssLink.rel = 'preload';
    cssLink.as = 'style';
    cssLink.href = 'css/style.css';
    document.head.appendChild(cssLink);
}

// 错误处理
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.error);
        // 可以在这里添加错误上报逻辑
    });

    // 处理图片加载错误
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WbvueJhzwvdGV4dD48L3N2Zz4=';
        }
    }, true);
}

// 初始化所有优化功能
optimizePagePerformance();
setupErrorHandling();

// 导出一些有用的函数供全局使用
window.SquatPlanner = {
    debounce,
    throttle,
    setupAnimations,
    setupSmoothScroll
};