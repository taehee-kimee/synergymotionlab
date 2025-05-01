document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.run-button');
    const startEasingSelect = document.getElementById('start-easing');
    const endEasingSelect = document.getElementById('end-easing');
    const motionTypeSelect = document.getElementById('motion-type');
    const motionEndTypeSelect = document.getElementById('motion-end-type');
    const useEndMotionCheckbox = document.getElementById('use-end-motion');
    const endMotionContainer = document.querySelector('.end-motion-container');
    const startCubicBezierInputs = document.getElementById('start-cubic-bezier-inputs');
    const endCubicBezierInputs = document.getElementById('end-cubic-bezier-inputs');
    const previewWidth = document.getElementById('preview-width');
    const previewHeight = document.getElementById('preview-height');
    const previewDistance = document.getElementById('preview-distance');
    const animatedElement = document.querySelector('.animated-element');
    const imageUpload = document.getElementById('image-upload');
    const sizeInputs = document.querySelector('.preview-inputs');
    const imageInfo = document.querySelector('.image-info');
    const imageName = document.querySelector('.image-name');
    const removeImageBtn = document.querySelector('.remove-image');

    // Start Bezier curve elements
    const startBezierCurve = startCubicBezierInputs.querySelector('.bezier-curve');
    const startP0 = document.getElementById('start-p0');
    const startP1 = document.getElementById('start-p1');
    const startP2 = document.getElementById('start-p2');
    const startP3 = document.getElementById('start-p3');
    const startL1 = document.getElementById('start-l1');
    const startL2 = document.getElementById('start-l2');

    // End Bezier curve elements
    const endBezierCurve = endCubicBezierInputs.querySelector('.bezier-curve');
    const endP0 = document.getElementById('end-p0');
    const endP1 = document.getElementById('end-p1');
    const endP2 = document.getElementById('end-p2');
    const endP3 = document.getElementById('end-p3');
    const endL1 = document.getElementById('end-l1');
    const endL2 = document.getElementById('end-l2');

    function updateBezierCurve(isStart) {
        const prefix = isStart ? 'start' : 'end';
        const x1 = document.getElementById(`${prefix}-bezier-x1`).value;
        const y1 = document.getElementById(`${prefix}-bezier-y1`).value;
        const x2 = document.getElementById(`${prefix}-bezier-x2`).value;
        const y2 = document.getElementById(`${prefix}-bezier-y2`).value;

        const p1 = document.getElementById(`${prefix}-p1`);
        const p2 = document.getElementById(`${prefix}-p2`);
        const l1 = document.getElementById(`${prefix}-l1`);
        const l2 = document.getElementById(`${prefix}-l2`);
        const curve = document.getElementById(`${prefix}-cubic-bezier-inputs`).querySelector('.bezier-curve');

        // Update control points
        p1.setAttribute('cx', x1 * 100);
        p1.setAttribute('cy', (1 - y1) * 100);
        p2.setAttribute('cx', x2 * 100);
        p2.setAttribute('cy', (1 - y2) * 100);

        // Update control lines
        l1.setAttribute('x2', x1 * 100);
        l1.setAttribute('y2', (1 - y1) * 100);
        l2.setAttribute('x1', x2 * 100);
        l2.setAttribute('y1', (1 - y2) * 100);

        // Update curve
        const path = `M 0 100 C ${x1 * 100} ${(1 - y1) * 100}, ${x2 * 100} ${(1 - y2) * 100}, 100 0`;
        curve.setAttribute('d', path);
    }

    // Update bezier curves when inputs change
    ['start', 'end'].forEach(prefix => {
        document.getElementById(`${prefix}-bezier-x1`).addEventListener('input', () => updateBezierCurve(prefix === 'start'));
        document.getElementById(`${prefix}-bezier-y1`).addEventListener('input', () => updateBezierCurve(prefix === 'start'));
        document.getElementById(`${prefix}-bezier-x2`).addEventListener('input', () => updateBezierCurve(prefix === 'start'));
        document.getElementById(`${prefix}-bezier-y2`).addEventListener('input', () => updateBezierCurve(prefix === 'start'));
    });

    // easing 함수 선택 시 cubic-bezier 입력 필드 표시/숨김 처리
    function handleEasingChange(isStart) {
        const prefix = isStart ? 'start' : 'end';
        const select = document.getElementById(`${prefix}-easing`);
        const container = document.getElementById(`${prefix}-easing-container`);
        
        // 모든 easing value 숨기기
        container.querySelectorAll('.easing-value').forEach(el => {
            el.style.display = 'none';
        });

        if (select.value === 'cubic-bezier') {
            document.getElementById(`${prefix}-cubic-bezier-inputs`).style.display = 'block';
            updateBezierCurve(isStart); // 초기 곡선 그리기
        } else {
            document.getElementById(`${prefix}-cubic-bezier-inputs`).style.display = 'none';
            // 선택된 easing 함수의 값 표시
            document.getElementById(`${prefix}-${select.value}-value`).style.display = 'block';
        }
    }

    startEasingSelect.addEventListener('change', () => handleEasingChange(true));
    endEasingSelect.addEventListener('change', () => handleEasingChange(false));

    // 초기 easing 함수 값 표시
    handleEasingChange(true);
    handleEasingChange(false);

    // 모션 타입 변경 시 초기 상태 설정
    motionTypeSelect.addEventListener('change', resetAnimationState);
    motionEndTypeSelect.addEventListener('change', resetAnimationState);

    // 이미지 업로드 처리
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // 이미지 크기를 preview input에 반영
                    previewWidth.value = img.width;
                    previewHeight.value = img.height;
                    updatePreviewSize();
                    
                    // 이미지를 element에 직접 삽입
                    animatedElement.innerHTML = '';
                    animatedElement.appendChild(img);
                    animatedElement.style.backgroundImage = 'none';
                    animatedElement.style.backgroundColor = 'transparent';

                    // UI 업데이트
                    sizeInputs.style.display = 'none';
                    imageName.textContent = file.name;
                    imageInfo.style.display = 'flex';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 이미지 제거 처리
    removeImageBtn.addEventListener('click', function() {
        // 이미지 제거
        animatedElement.innerHTML = '';
        animatedElement.style.backgroundColor = 'var(--primary-color)';
        
        // UI 초기화
        sizeInputs.style.display = 'flex';
        imageInfo.style.display = 'none';
        imageName.textContent = '';
        imageUpload.value = '';
        
        // 크기 초기화
        previewWidth.value = '50';
        previewHeight.value = '50';
        updatePreviewSize();
    });

    // Preview object 크기 변경 시 즉시 적용
    function updatePreviewSize() {
        animatedElement.style.width = `${previewWidth.value}px`;
        animatedElement.style.height = `${previewHeight.value}px`;
    }

    previewWidth.addEventListener('change', updatePreviewSize);
    previewHeight.addEventListener('change', updatePreviewSize);

    // End Motion 토글 처리
    useEndMotionCheckbox.addEventListener('change', function() {
        const motionEndGroup = document.querySelector('.motion-end-group');
        if (this.checked) {
            motionEndGroup.style.display = 'flex';
        } else {
            motionEndGroup.style.display = 'none';
        }
    });

    button.addEventListener('click', function() {
        const element = document.querySelector('.animated-element');
        const distance = document.getElementById('preview-distance').value;
        const startEasing = document.getElementById('start-easing').value;
        const startDuration = document.getElementById('start-duration').value;
        const motionType = document.getElementById('motion-type').value;
        const useEndMotion = document.getElementById('use-end-motion').checked;

        // Slide in의 경우 distance가 필수값
        if (motionType === 'slide' && (!distance || distance === '0')) {
            const distanceInput = document.getElementById('preview-distance');
            distanceInput.classList.add('error');
            return;
        }

        // 시작 easing 값 계산
        let startEasingValue = startEasing;
        if (startEasing === 'cubic-bezier') {
            const x1 = document.getElementById('start-bezier-x1').value;
            const y1 = document.getElementById('start-bezier-y1').value;
            const x2 = document.getElementById('start-bezier-x2').value;
            const y2 = document.getElementById('start-bezier-y2').value;
            startEasingValue = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
        } else {
            const easingInput = document.getElementById(`start-${startEasing}-value`).querySelector('input');
            startEasingValue = easingInput.value;
        }

        // 초기 상태 설정
        resetAnimationState();
        
        // 시작 애니메이션
        element.style.transition = `all ${startDuration}ms ${startEasingValue}`;
        
        // 시작 모션 타입에 따른 속성 설정
        switch(motionType) {
            case 'slide':
                element.style.left = `calc(100px + ${distance}px)`;
                break;
            case 'fade':
                element.style.opacity = '1';
                element.style.left = distance && distance !== '0' ? `calc(100px + ${distance}px)` : '100px';
                break;
            case 'zoom':
                element.style.transform = 'translateY(-50%) scale(1)';
                element.style.left = distance && distance !== '0' ? `calc(100px + ${distance}px)` : '100px';
                break;
        }

        // 끝 애니메이션이 활성화된 경우에만 실행
        if (useEndMotion) {
            const endEasing = document.getElementById('end-easing').value;
            const endDuration = document.getElementById('end-duration').value;
            const motionEndType = document.getElementById('motion-end-type').value;

            // Slide out의 경우 distance가 필수값
            if (motionEndType === 'slide' && (!distance || distance === '0')) {
                const distanceInput = document.getElementById('preview-distance');
                distanceInput.classList.add('error');
                return;
            }

            // 끝 easing 값 계산
            let endEasingValue = endEasing;
            if (endEasing === 'cubic-bezier') {
                const x1 = document.getElementById('end-bezier-x1').value;
                const y1 = document.getElementById('end-bezier-y1').value;
                const x2 = document.getElementById('end-bezier-x2').value;
                const y2 = document.getElementById('end-bezier-y2').value;
                endEasingValue = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
            } else {
                const easingInput = document.getElementById(`end-${endEasing}-value`).querySelector('input');
                endEasingValue = easingInput.value;
            }

            // 끝 애니메이션
            setTimeout(() => {
                element.style.transition = `all ${endDuration}ms ${endEasingValue}`;
                
                // 끝 모션 타입에 따른 속성 설정
                switch(motionEndType) {
                    case 'slide':
                        element.style.left = '100px';
                        break;
                    case 'fade':
                        element.style.opacity = '0';
                        element.style.left = '100px';
                        break;
                    case 'zoom':
                        element.style.transform = 'translateY(-50%) scale(0)';
                        element.style.left = '100px';
                        break;
                }
            }, startDuration);
        }
    });

    // distance input의 error 클래스 제거
    document.getElementById('preview-distance').addEventListener('input', function() {
        this.classList.remove('error');
    });

    // --- 베지어 컨트롤 포인트 드래그 기능 추가 ---
    let draggingPoint = null;

    function svgToBezierValue(x, y) {
        // SVG 좌표(0~100)를 bezier 값(0~1)으로 변환
        return {
            x: Math.max(0, Math.min(1, x / 100)),
            y: Math.max(0, Math.min(1, 1 - y / 100))
        };
    }

    function onPointerDown(e) {
        const isStart = e.target.id.startsWith('start');
        const prefix = isStart ? 'start' : 'end';
        if (e.target.id === `${prefix}-p1` || e.target.id === `${prefix}-p2`) {
            draggingPoint = e.target.id;
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        }
    }

    function onPointerMove(e) {
        const isStart = draggingPoint.startsWith('start');
        const prefix = isStart ? 'start' : 'end';
        const svg = document.querySelector(`#${prefix}-cubic-bezier-inputs .bezier-graph svg`);
        const rect = svg.getBoundingClientRect();
        // 마우스 위치를 SVG 좌표계로 변환
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const { x: bx, y: by } = svgToBezierValue(x, y);

        if (draggingPoint === `${prefix}-p1`) {
            document.getElementById(`${prefix}-bezier-x1`).value = bx.toFixed(2);
            document.getElementById(`${prefix}-bezier-y1`).value = by.toFixed(2);
            document.getElementById(`${prefix}-bezier-x1`).dispatchEvent(new Event('input'));
            document.getElementById(`${prefix}-bezier-y1`).dispatchEvent(new Event('input'));
        } else if (draggingPoint === `${prefix}-p2`) {
            document.getElementById(`${prefix}-bezier-x2`).value = bx.toFixed(2);
            document.getElementById(`${prefix}-bezier-y2`).value = by.toFixed(2);
            document.getElementById(`${prefix}-bezier-x2`).dispatchEvent(new Event('input'));
            document.getElementById(`${prefix}-bezier-y2`).dispatchEvent(new Event('input'));
        }
    }

    function onPointerUp() {
        draggingPoint = null;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
    }

    // SVG 컨트롤 포인트에 이벤트 등록
    ['start', 'end'].forEach(prefix => {
        const p1 = document.getElementById(`${prefix}-p1`);
        const p2 = document.getElementById(`${prefix}-p2`);
        if (p1 && p2) {
            p1.addEventListener('pointerdown', onPointerDown);
            p2.addEventListener('pointerdown', onPointerDown);
        }
    });
});

function resetAnimationState() {
    const element = document.querySelector('.animated-element');
    const motionType = document.getElementById('motion-type').value;
    
    // 모든 트랜지션 제거
    element.style.transition = 'none';
    
    // 초기 상태 설정
    element.style.opacity = motionType === 'fade' ? '0' : '1';
    element.style.transform = motionType === 'zoom' ? 'translateY(-50%) scale(0)' : 'translateY(-50%)';
    element.style.left = '100px';
    element.style.top = '50%';
    
    // Force reflow
    void element.offsetHeight;
} 