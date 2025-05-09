document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('button');
    const easingSelect = document.getElementById('easing');
    const motionTypeSelect = document.getElementById('motion-type');
    const cubicBezierInputs = document.getElementById('cubic-bezier-inputs');
    const previewWidth = document.getElementById('preview-width');
    const previewHeight = document.getElementById('preview-height');
    const previewDistance = document.getElementById('preview-distance');
    const animatedElement = document.querySelector('.animated-element');

    // easing 함수 선택 시 cubic-bezier 입력 필드 표시/숨김 처리
    easingSelect.addEventListener('change', function() {
        // 모든 easing value 숨기기
        document.querySelectorAll('.easing-value').forEach(el => {
            el.style.display = 'none';
        });

        if (this.value === 'cubic-bezier') {
            cubicBezierInputs.style.display = 'block';
        } else {
            cubicBezierInputs.style.display = 'none';
            // 선택된 easing 함수의 값 표시
            document.getElementById(`${this.value}-value`).style.display = 'block';
        }
    });

    // 초기 easing 함수 값 표시
    document.getElementById(`${easingSelect.value}-value`).style.display = 'block';

    // 모션 타입 변경 시 초기 상태 설정
    motionTypeSelect.addEventListener('change', function() {
        resetAnimationState();
    });

    // Preview object 크기 변경 시 즉시 적용
    function updatePreviewSize() {
        animatedElement.style.width = `${previewWidth.value}px`;
        animatedElement.style.height = `${previewHeight.value}px`;
    }

    previewWidth.addEventListener('change', updatePreviewSize);
    previewHeight.addEventListener('change', updatePreviewSize);

    button.addEventListener('click', animate);
});

function resetAnimationState() {
    const element = document.querySelector('.animated-element');
    const motionType = document.getElementById('motion-type').value;
    
    // 모든 트랜지션 제거
    element.style.transition = 'none';
    
    // 모션 타입별 초기 상태 설정
    switch(motionType) {
        case 'slide':
            element.style.opacity = '1';
            element.style.transform = 'translateY(-50%) scale(1)';
            element.style.left = '0';
            break;
        case 'fade':
            element.style.opacity = '0';
            element.style.transform = 'translateY(-50%) scale(1)';
            element.style.left = '50px';
            break;
        case 'zoom':
            element.style.opacity = '1';
            element.style.transform = 'translateY(-50%) scale(0)';
            element.style.left = '50px';
            break;
    }
    
    // Force reflow
    void element.offsetHeight;
}

function animate() {
    const element = document.querySelector('.animated-element');
    const easing = document.getElementById('easing').value;
    const duration = document.getElementById('duration').value;
    const distance = document.getElementById('preview-distance').value;
    const motionType = document.getElementById('motion-type').value;

    let easingValue = easing;
    if (easing === 'cubic-bezier') {
        const x1 = document.getElementById('bezier-x1').value;
        const y1 = document.getElementById('bezier-y1').value;
        const x2 = document.getElementById('bezier-x2').value;
        const y2 = document.getElementById('bezier-y2').value;
        easingValue = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    } else {
        // 선택된 easing 함수의 값을 가져옴
        const easingInput = document.getElementById(`${easing}-value`).querySelector('input');
        easingValue = easingInput.value;
    }

    // Reset position
    resetAnimationState();
    
    // Apply animation based on motion type
    element.style.transition = `all ${duration}ms ${easingValue}`;
    
    switch(motionType) {
        case 'slide':
            element.style.left = `${distance}px`;
            break;
        case 'fade':
            element.style.opacity = '1';
            element.style.left = `${distance}px`;
            break;
        case 'zoom':
            element.style.transform = 'translateY(-50%) scale(1)';
            element.style.left = `${distance}px`;
            break;
    }
} 