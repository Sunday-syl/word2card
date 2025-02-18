document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const bgColor = document.getElementById('bgColor');
    const bgImage = document.getElementById('bgImage');
    const bgOpacity = document.getElementById('bgOpacity');
    const addCard = document.getElementById('addCard');
    const downloadCard = document.getElementById('downloadCard');
    const cardContainer = document.querySelector('.card-container');
    const fontSize = document.getElementById('fontSize');
    const watermarkText = document.getElementById('watermarkText');
    const watermarkOpacity = document.getElementById('watermarkOpacity');
    const cardsWrapper = document.querySelector('.cards-wrapper');
    const letterSpacing = document.getElementById('letterSpacing');
    const letterSpacingValue = document.getElementById('letterSpacingValue');
    const lineHeight = document.getElementById('lineHeight');
    const lineHeightValue = document.getElementById('lineHeightValue');
    const textTemplate = document.getElementById('textTemplate');
    const removeBgImage = document.getElementById('removeBgImage');
    const textColor = document.getElementById('textColor');
    const deleteCard = document.getElementById('deleteCard');
    
    // 当前卡片索引
    let currentCardIndex = 0;
    let cards = [document.querySelector('.text-card')];

    // 当前选中的卡片容器集合
    let selectedContainers = new Set([document.querySelector('.card-container')]);
    let selectedContainer = document.querySelector('.card-container');
    selectedContainer.classList.add('selected');

    // 定义模板配置
    const templates = {
        natural: {
            bgColor: '#E6F7FF',
            textColor: '#333333',
            fontSize: '16px',
            letterSpacing: '1px',
            lineHeight: '180%'
        },
        luxury: {
            bgColor: '#F5F5DC',
            textColor: '#6B4226',
            fontSize: '18px',
            letterSpacing: '2px',
            lineHeight: '200%'
        },
        business: {
            bgColor: '#FFFFFF',
            textColor: '#000000',
            fontSize: '16px',
            letterSpacing: '1px',
            lineHeight: '160%'
        },
        youth: {
            bgColor: '#FFD700',
            textColor: '#000000',
            fontSize: '20px',
            letterSpacing: '2px',
            lineHeight: '170%'
        },
        retro: {
            bgColor: '#F0E68C',
            textColor: '#8B4513',
            fontSize: '17px',
            letterSpacing: '1.5px',
            lineHeight: '190%'
        },
        pink: {
            bgColor: '#FFC0CB',
            textColor: '#FFFFFF',
            fontSize: '18px',
            letterSpacing: '1px',
            lineHeight: '180%'
        },
        red: {
            bgColor: '#FF6347',
            textColor: '#FFFFFF',
            fontSize: '20px',
            letterSpacing: '1.5px',
            lineHeight: '170%'
        },
        black: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            fontSize: '18px',
            letterSpacing: '1px',
            lineHeight: '160%'
        }
    };

    // 更新选中态
    function updateSelection(newContainer, isMultiSelect) {
        if (!isMultiSelect) {
            // 单选模式：清除所有选中状态
            selectedContainers.forEach(container => {
                container.classList.remove('selected', 'multi-selected');
            });
            selectedContainers.clear();
            selectedContainers.add(newContainer);
            newContainer.classList.add('selected');
        } else {
            // 多选模式
            if (selectedContainers.has(newContainer)) {
                // 如果已经选中，则取消选中
                selectedContainers.delete(newContainer);
                newContainer.classList.remove('multi-selected');
            } else {
                // 添加到选中集合
                selectedContainers.add(newContainer);
                newContainer.classList.remove('selected');
                newContainer.classList.add('multi-selected');
            }
        }
        
        selectedContainer = newContainer;
        currentCardIndex = cards.indexOf(selectedContainer.querySelector('.text-card'));
        
        // 更新控制面板的值
        const card = selectedContainer.querySelector('.text-card');
        fontSize.value = parseInt(getComputedStyle(card).fontSize) || 16;
        letterSpacing.value = parseInt(getComputedStyle(card).letterSpacing) || 0;
        letterSpacingValue.textContent = `${letterSpacing.value}px`;
        lineHeight.value = parseInt(getComputedStyle(card).lineHeight) || 150;
        lineHeightValue.textContent = `${lineHeight.value}%`;
        bgColor.value = rgbToHex(getComputedStyle(card).backgroundColor);
        textColor.value = rgbToHex(getComputedStyle(card).color);

        // 更新删除按钮状态
        deleteCard.disabled = cards.length <= 1;
        deleteCard.style.opacity = cards.length <= 1 ? '0.5' : '1';
    }

    // RGB颜色转换为十六进制
    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        const [r, g, b] = rgb.match(/\d+/g);
        return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
    }

    // 应用样式到所有选中的卡片
    function applyStyleToSelected(styleApplier) {
        selectedContainers.forEach(container => {
            const card = container.querySelector('.text-card');
            styleApplier(card);
        });
    }

    // 行间距调整
    lineHeight.addEventListener('input', function(e) {
        const value = e.target.value;
        lineHeightValue.textContent = `${value}%`;
        applyStyleToSelected(card => {
            card.style.lineHeight = `${value}%`;
        });
    });

    // 修改字间距事件
    letterSpacing.addEventListener('input', function(e) {
        const value = e.target.value;
        letterSpacingValue.textContent = `${value}px`;
        applyStyleToSelected(card => {
            card.style.letterSpacing = `${value}px`;
        });
    });

    // 修改背景颜色事件
    bgColor.addEventListener('input', function(e) {
        applyStyleToSelected(card => {
            const overlay = card.querySelector('.bg-overlay') || card;
            overlay.style.backgroundColor = e.target.value;
        });
    });

    // 修改背景图片事件
    bgImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                applyStyleToSelected(card => {
                    const overlay = card.querySelector('.bg-overlay') || card;
                    overlay.style.backgroundImage = `url(${imageUrl})`;
                    overlay.style.backgroundSize = 'cover';
                    overlay.style.backgroundPosition = 'center';
                });
                // 显示删除按钮
                removeBgImage.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    });

    // 修改背景透明度事件
    bgOpacity.addEventListener('input', function(e) {
        const opacity = e.target.value / 100;
        applyStyleToSelected(card => {
            // 创建或更新背景遮罩层
            let overlay = card.querySelector('.bg-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'bg-overlay';
                // 将现有的背景转移到遮罩层
                overlay.style.backgroundImage = card.style.backgroundImage;
                overlay.style.backgroundColor = card.style.backgroundColor;
                overlay.style.backgroundSize = card.style.backgroundSize;
                overlay.style.backgroundPosition = card.style.backgroundPosition;
                
                // 清除卡片本身的背景
                card.style.backgroundImage = 'none';
                card.style.backgroundColor = 'transparent';
                
                // 插入遮罩层作为第一个子元素
                card.insertBefore(overlay, card.firstChild);
            }
            overlay.style.opacity = opacity;
        });
    });

    // 修改字体大小事件
    fontSize.addEventListener('input', function(e) {
        applyStyleToSelected(card => {
            card.style.fontSize = `${e.target.value}px`;
        });
    });

    // 修改水印更新逻辑，确保透明度可以批量调整
    watermarkOpacity.addEventListener('input', function() {
        selectedContainers.forEach(container => {
            const watermark = container.querySelector('.watermark');
            if (watermark) {
                watermark.style.opacity = this.value / 100;
            }
        });
    });

    // 修改水印文本更改事件
    watermarkText.addEventListener('input', function() {
        selectedContainers.forEach(container => {
            const watermark = container.querySelector('.watermark');
            if (watermarkText.value) {
                watermark.style.opacity = watermarkOpacity.value / 100;
                watermark.style.display = 'grid';
                watermark.innerHTML = '';
                
                for (let i = 0; i < 9; i++) {
                    const pattern = document.createElement('div');
                    pattern.className = 'watermark-pattern';
                    pattern.textContent = watermarkText.value;
                    watermark.appendChild(pattern);
                }
            } else {
                watermark.style.display = 'none';
            }
        });
    });

    // 修改新增卡片事件，继承当前选中卡片的样式
    addCard.addEventListener('click', function() {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        
        const newCard = document.createElement('div');
        newCard.className = 'text-card';
        newCard.contentEditable = true;
        newCard.textContent = '点击输入文字...';
        
        // 继承当前选中卡片的样式
        if (selectedContainer) {
            const currentCard = selectedContainer.querySelector('.text-card');
            newCard.style.backgroundColor = currentCard.style.backgroundColor;
            newCard.style.color = currentCard.style.color;
            newCard.style.fontSize = currentCard.style.fontSize;
            newCard.style.letterSpacing = currentCard.style.letterSpacing;
            newCard.style.lineHeight = currentCard.style.lineHeight;
            newCard.style.backgroundImage = currentCard.style.backgroundImage;
            newCard.style.backgroundSize = currentCard.style.backgroundSize;
            newCard.style.backgroundPosition = currentCard.style.backgroundPosition;
        }
        
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        
        cardContainer.appendChild(newCard);
        cardContainer.appendChild(watermark);
        cardsWrapper.appendChild(cardContainer);
        
        cards.push(newCard);
        
        // 为新卡片添加点击事件
        cardContainer.addEventListener('click', function(e) {
            updateSelection(this, e.metaKey || e.ctrlKey);
        });
        
        // 选中新卡片
        updateSelection(cardContainer, false);
    });

    // 为初始卡片添加点击事件
    selectedContainer.addEventListener('click', function(e) {
        updateSelection(this, e.metaKey || e.ctrlKey);
    });

    // 修改下载卡片事件
    downloadCard.addEventListener('click', function() {
        if (typeof html2canvas === 'undefined') {
            alert('请先引入html2canvas库！');
            return;
        }

        // 获取当前时间并格式化
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${month}-${day}-${hours}${minutes}`;

        // 遍历所有选中的卡片并下载
        let index = 1;
        selectedContainers.forEach(container => {
            // 创建临时容器进行渲染
            const tempContainer = container.cloneNode(true);
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            document.body.appendChild(tempContainer);

            // 确保文本样式正确应用
            const tempCard = tempContainer.querySelector('.text-card');
            const originalCard = container.querySelector('.text-card');
            
            // 复制所有计算后的样式
            const computedStyle = window.getComputedStyle(originalCard);
            for (const prop of computedStyle) {
                tempCard.style[prop] = computedStyle.getPropertyValue(prop);
            }

            // 特别处理文本相关样式
            tempCard.style.wordBreak = 'break-all';
            tempCard.style.whiteSpace = 'pre-wrap';
            tempCard.style.wordWrap = 'break-word';

            // 使用html2canvas生成图片
            html2canvas(tempContainer, {
                useCORS: true,
                scale: 2, // 提高清晰度
                allowTaint: true,
                letterRendering: true,
                onclone: function(clonedDoc) {
                    // 确保克隆的DOM已完全渲染
                    const clonedCard = clonedDoc.querySelector('.text-card');
                    if (clonedCard) {
                        clonedCard.style.visibility = 'visible';
                    }
                }
            }).then(canvas => {
                const link = document.createElement('a');
                const fileName = `${timeStr}_${index}.png`;
                link.download = fileName;
                link.href = canvas.toDataURL('image/png');
                link.click();
                index++;
                
                // 清理临时元素
                document.body.removeChild(tempContainer);
            });
        });
    });

    // 添加模板选择事件
    textTemplate.addEventListener('change', function(e) {
        const template = templates[e.target.value];
        if (template) {
            applyStyleToSelected(card => {
                card.style.backgroundColor = template.bgColor;
                card.style.color = template.textColor;
                card.style.fontSize = template.fontSize;
                card.style.letterSpacing = template.letterSpacing;
                card.style.lineHeight = template.lineHeight;
            });

            // 更新控制面板的值
            bgColor.value = template.bgColor;
            fontSize.value = parseInt(template.fontSize);
            letterSpacing.value = parseInt(template.letterSpacing);
            letterSpacingValue.textContent = template.letterSpacing;
            lineHeight.value = parseInt(template.lineHeight);
            lineHeightValue.textContent = `${parseInt(template.lineHeight)}%`;
            textColor.value = template.textColor;
        }
    });

    // 修改删除背景图片事件
    removeBgImage.addEventListener('click', function(e) {
        e.stopPropagation();
        applyStyleToSelected(card => {
            const overlay = card.querySelector('.bg-overlay');
            if (overlay) {
                overlay.style.backgroundImage = 'none';
            }
        });
        bgImage.value = '';
        removeBgImage.style.display = 'none';
    });

    // 添加文字颜色更改事件
    textColor.addEventListener('input', function(e) {
        applyStyleToSelected(card => {
            card.style.color = e.target.value;
        });
    });

    // 添加删除卡片事件
    deleteCard.addEventListener('click', function() {
        // 如果没有选中的卡片或只剩最后一张卡片，不执行删除
        if (selectedContainers.size === 0 || cards.length === 1) {
            return;
        }

        // 获取要删除的卡片容器数组
        const containersToDelete = Array.from(selectedContainers);

        // 删除选中的卡片
        containersToDelete.forEach(container => {
            const card = container.querySelector('.text-card');
            const cardIndex = cards.indexOf(card);
            if (cardIndex > -1) {
                cards.splice(cardIndex, 1);
            }
            container.remove();
            selectedContainers.delete(container);
        });

        // 如果还有剩余卡片，选中第一张
        if (cards.length > 0) {
            const firstContainer = document.querySelector('.card-container');
            if (firstContainer) {
                updateSelection(firstContainer, false);
            }
        }
    });

    // 在页面加载时初始化删除按钮状态
    deleteCard.disabled = cards.length <= 1;
    deleteCard.style.opacity = cards.length <= 1 ? '0.5' : '1';
}); 