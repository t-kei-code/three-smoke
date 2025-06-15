import * as THREE from "three";

function init() {
  const canvas = document.querySelector("canvas");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const textureLoader = new THREE.TextureLoader();
  const bg = textureLoader.load("public/smoke.png");
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: bg,
    transparent: true,
    opacity: 0.2,
  });

  let count = 500;
  const smokeMeshes = []; // 煙のメッシュを格納する配列

  // カメラの視野サイズを計算する関数
  function getViewSize() {
    const aspect = window.innerWidth / window.innerHeight;
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z; // カメラの視野の高さ
    const width = height * aspect; // カメラの視野の幅
    return { width, height };
  }

  function smoke() {
    const { width, height } = getViewSize(); // 初期位置計算に使用

    for (let i = 0; i < count; i++) {
      const smokeMesh = new THREE.Mesh(geometry, material);
      smokeMesh.position.set(
        Math.random() * width - width / 2, // X座標を視野幅に基づいてランダムに配置
        Math.random() * height - height / 2, // Y座標を視野高さに基づいてランダムに配置
        0 // Z座標
      );
      smokeMesh.rotation.z = Math.random() * Math.PI * 2;
      smokeMeshes.push(smokeMesh); // 配列に追加
      scene.add(smokeMesh);
    }
  }
  smoke();

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);

    const { width, height } = getViewSize(); // 毎フレーム視野サイズを更新

    // 全ての煙を回転させ、右に流す
    smokeMeshes.forEach((smokeMesh) => {
      smokeMesh.rotation.z += 0.006; // 回転
      smokeMesh.position.x += 0.002; // 右に流れる

      // 画面外に出たら再配置
      if (smokeMesh.position.x > width / 2) {
        smokeMesh.position.x = -width / 2 - Math.random(); // 左端の外側に再配置
        smokeMesh.position.y = Math.random() * height - height / 2; // ランダムな高さ
      }
    });

    renderer.render(scene, camera);
  }

  animate();
}

init();
