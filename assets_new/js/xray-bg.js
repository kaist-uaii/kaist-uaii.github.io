// X-Ray City — transparent buildings revealing internal data flows
(function() {
  var container = document.getElementById('landingmap');
  if (!container) return;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03070f, 0.009);

  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 250);
  camera.position.set(0, 20, 40);
  camera.lookAt(0, 5, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x03070f);
  container.appendChild(renderer.domElement);

  var neonColors = [0x2563eb, 0x0ea5e9, 0x06b6d4, 0x3b82f6, 0x60a5fa, 0x6366f1];

  // --- Ground grid ---
  var gridHelper = new THREE.GridHelper(90, 50, 0x0d2540, 0x081a2e);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.3;
  scene.add(gridHelper);

  // --- X-Ray buildings ---
  var buildings = [];
  var spacing = 3.4;
  var range = 8;

  for (var bx = -range; bx <= range; bx++) {
    for (var bz = -range; bz <= range; bz++) {
      var dist = Math.sqrt(bx * bx + bz * bz);
      if (dist > range * 1.0) continue;
      if (Math.random() > 0.65) continue;

      var wx = bx * spacing + (Math.random() - 0.5) * 0.5;
      var wz = bz * spacing + (Math.random() - 0.5) * 0.5;
      var h = (0.8 + Math.random() * 9) * Math.max(0.25, 1 - dist / (range * 1.15));
      var w = 1.2 + Math.random() * 1.2;
      var d = 1.2 + Math.random() * 1.2;
      var col = neonColors[Math.floor(Math.random() * neonColors.length)];

      var geo = new THREE.BoxGeometry(w, h, d);

      // Ghost shell — very transparent
      var shellMat = new THREE.MeshBasicMaterial({
        color: col, transparent: true, opacity: 0.04, side: THREE.DoubleSide
      });
      var shell = new THREE.Mesh(geo, shellMat);
      shell.position.set(wx, h / 2, wz);
      scene.add(shell);

      // Edge wireframe
      var edgeMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.4 });
      var edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
      edges.position.copy(shell.position);
      scene.add(edges);

      // Internal floors (horizontal slices)
      var floors = [];
      var floorCount = Math.floor(h / 1.2);
      for (var f = 1; f < floorCount; f++) {
        var fy = f * (h / floorCount);
        var fPts = [
          new THREE.Vector3(-w/2, 0, -d/2),
          new THREE.Vector3( w/2, 0, -d/2),
          new THREE.Vector3( w/2, 0,  d/2),
          new THREE.Vector3(-w/2, 0,  d/2),
          new THREE.Vector3(-w/2, 0, -d/2),
        ];
        var fGeo = new THREE.BufferGeometry().setFromPoints(fPts);
        var fMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.12 });
        var fLine = new THREE.Line(fGeo, fMat);
        fLine.position.set(wx, fy, wz);
        scene.add(fLine);
        floors.push(fLine);
      }

      // Internal data particle (one bright dot per building)
      var dpGeo = new THREE.SphereGeometry(0.08, 5, 5);
      var dpMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      var dp = new THREE.Mesh(dpGeo, dpMat);
      scene.add(dp);

      buildings.push({
        shell, edges, floors, dp,
        wx, wz, h, w, d, col,
        phase: Math.random() * Math.PI * 2,
        dpSpeed: 0.5 + Math.random() * 1.5
      });
    }
  }

  // --- Inter-building data streams (horizontal lines between buildings at various heights) ---
  var streams = [];
  for (var i = 0; i < buildings.length; i++) {
    for (var j = i + 1; j < buildings.length; j++) {
      var dx = buildings[i].wx - buildings[j].wx;
      var dz = buildings[i].wz - buildings[j].wz;
      var dd = Math.sqrt(dx * dx + dz * dz);
      if (dd < 7 && streams.length < 80 && Math.random() > 0.55) {
        var sh = Math.min(buildings[i].h, buildings[j].h) * (0.3 + Math.random() * 0.5);
        var sPts = [
          new THREE.Vector3(buildings[i].wx, sh, buildings[i].wz),
          new THREE.Vector3(buildings[j].wx, sh, buildings[j].wz)
        ];
        var sGeo = new THREE.BufferGeometry().setFromPoints(sPts);
        var sMat = new THREE.LineBasicMaterial({
          color: neonColors[Math.floor(Math.random() * neonColors.length)],
          transparent: true, opacity: 0
        });
        var sLine = new THREE.Line(sGeo, sMat);
        scene.add(sLine);
        streams.push({ line: sLine, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.7 });
      }
    }
  }

  // --- Signal pulses moving between buildings ---
  var pulses = [];
  for (var p = 0; p < 50; p++) {
    if (streams.length === 0) break;
    var s = streams[Math.floor(Math.random() * streams.length)];
    var pGeo = new THREE.SphereGeometry(0.12, 5, 5);
    var pCol = neonColors[Math.floor(Math.random() * neonColors.length)];
    var pMat = new THREE.MeshBasicMaterial({ color: pCol, transparent: true, opacity: 0.95 });
    var pMesh = new THREE.Mesh(pGeo, pMat);
    scene.add(pMesh);
    pulses.push({ mesh: pMesh, stream: s, t: Math.random(), speed: 0.006 + Math.random() * 0.01 });
  }

  var time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.004;

    // Camera slow orbit
    camera.position.x = 40 * Math.sin(time * 0.06);
    camera.position.z = 40 * Math.cos(time * 0.06);
    camera.position.y = 20 + 5 * Math.sin(time * 0.04);
    camera.lookAt(0, 5, 0);

    // Buildings: edge brightness + internal particle bounce
    buildings.forEach(function(b) {
      b.edges.material.opacity = 0.25 + 0.2 * Math.abs(Math.sin(time * 0.8 + b.phase));
      b.shell.material.opacity = 0.02 + 0.04 * Math.abs(Math.sin(time * 0.5 + b.phase));

      // Data particle bounces vertically inside building
      var dpY = 0.2 + (b.h - 0.4) * (0.5 + 0.5 * Math.sin(time * b.dpSpeed + b.phase));
      b.dp.position.set(b.wx, dpY, b.wz);
      b.dp.material.opacity = 0.6 + 0.4 * Math.abs(Math.sin(time * b.dpSpeed * 1.5 + b.phase));
    });

    // Horizontal streams flicker
    streams.forEach(function(s) {
      s.line.material.opacity = Math.max(0, Math.sin(time * s.speed + s.phase) * 0.35);
    });

    // Pulses travel along streams
    pulses.forEach(function(p) {
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.stream = streams[Math.floor(Math.random() * streams.length)];
      }
      var posArr = p.stream.line.geometry.attributes.position.array;
      var fromV = new THREE.Vector3(posArr[0], posArr[1], posArr[2]);
      var toV   = new THREE.Vector3(posArr[3], posArr[4], posArr[5]);
      p.mesh.position.lerpVectors(fromV, toV, p.t);
      p.mesh.material.opacity = Math.sin(p.t * Math.PI) * 0.9;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
