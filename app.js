
const PRICING_MATRIX = {
  basic: { INR: { monthly: 1000, annual: 1000 * 12 * 0.8 }, USD: { monthly: 12, annual: 12 * 12 * 0.8 }, EUR: { monthly: 11, annual: 11 * 12 * 0.8 } },
  pro: { INR: { monthly: 2500, annual: 2500 * 12 * 0.8 }, USD: { monthly: 30, annual: 30 * 12 * 0.8 }, EUR: { monthly: 28, annual: 28 * 12 * 0.8 } },
  enterprise: { INR: { monthly: 6000, annual: 6000 * 12 * 0.8 }, USD: { monthly: 75, annual: 75 * 12 * 0.8 }, EUR: { monthly: 70, annual: 70 * 12 * 0.8 } }
};

let activeCurrency = 'USD';
let activeBilling = 'monthly';
let globalSyncIndex = 0; // State Persistence Index Lock

const currencySymbols = { INR: '₹', USD: '$', EUR: '€' };


function runIsolatedMatrixUpdate() {
  const targets = ['basic', 'pro', 'enterprise'];
  targets.forEach(tier => {
    const textNode = document.getElementById(`tier-${tier}-price`);
    if (textNode) {
      const computedValue = PRICING_MATRIX[tier][activeCurrency][activeBilling];
      textNode.textContent = `${currencySymbols[activeCurrency]}${computedValue.toFixed(0)}`;
    }
  });
}


function setGlobalInteractionState(targetIndex) {
  globalSyncIndex = parseInt(targetIndex);
  

  document.querySelectorAll('.bento-node').forEach(node => {
    node.classList.toggle('active', parseInt(node.dataset.index) === globalSyncIndex);
  });
  

  document.querySelectorAll('.accordion-item').forEach(item => {
    const nestedPanel = item.querySelector('.accordion-content');
    const statusIcon = item.querySelector('.icon');
    if (parseInt(item.dataset.index) === globalSyncIndex) {
      item.classList.add('active');
      nestedPanel.style.maxHeight = nestedPanel.scrollHeight + "px";
      if (statusIcon) statusIcon.textContent = '−';
    } else {
      item.classList.remove('active');
      nestedPanel.style.maxHeight = "0px";
      if (statusIcon) statusIcon.textContent = '+';
    }
  });
}

function initializeFaqAccordion() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const icon = trigger.querySelector('.faq-icon');
      const isOpen = item.classList.contains('active');
      
     
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-content').style.maxHeight = "0px";
        el.querySelector('.faq-icon').textContent = '+';
      });
      
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        icon.textContent = '−';
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('currency-matrix-selector').addEventListener('change', (e) => {
    activeCurrency = e.target.value;
    runIsolatedMatrixUpdate();
  });

  document.getElementById('billing-cycle-checkbox').addEventListener('change', (e) => {
    activeBilling = e.target.checked ? 'annual' : 'monthly';
    document.getElementById('label-monthly').classList.toggle('active', !e.target.checked);
    document.getElementById('label-annual').classList.toggle('active', e.target.checked);
    runIsolatedMatrixUpdate();
  });

  document.querySelectorAll('.bento-node').forEach(node => {
    node.addEventListener('mouseenter', () => setGlobalInteractionState(node.dataset.index));
  });

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      setGlobalInteractionState(trigger.closest('.accordion-item').dataset.index);
    });
  });


  runIsolatedMatrixUpdate();
  setGlobalInteractionState(0);
  initializeFaqAccordion();
});


 
function initThreeJSEngine() {
  const container = document.querySelector('.hero-visual');
  if (!container) return;


  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  

  const placeholder = container.querySelector('.visual-matrix-mesh');
  if (placeholder) placeholder.style.background = 'none';
  
  container.appendChild(renderer.domElement);


  const particleCount = 450;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
   
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.15; 

    positions[i] = r * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = r * Math.cos(phi);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

 
  const material = new THREE.PointsMaterial({
    color: 0xFF9932,
    size: 0.015,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);


  function renderFrameTick() {
    requestAnimationFrame(renderFrameTick);
    
    // Smooth deterministic rotation velocities
    particleSystem.rotation.y += 0.002;
    particleSystem.rotation.x += 0.001;
    
    renderer.render(scene, camera);
  }
  renderFrameTick();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}


document.addEventListener('DOMContentLoaded', () => {

  initThreeJSEngine();
});