// Interactive project demos on the home page. Both open in a <dialog> from a "Try it" button
// and fetch their data only when opened, so they add nothing to the initial page load.
//
//  - miniRT: a slider (or a drag on the picture) turns the cylinder. Every position is a frame
//    the ray tracer itself rendered; the frames sit in one sprite sheet, 6 columns by 4 rows.
//  - minishell: a terminal that replays output recorded from the real minishell binary for a
//    fixed set of commands. A C shell that forks processes cannot run in a browser, so this
//    is a replay, and the dialog says so.
(function () {
  if (!window.HTMLDialogElement) return;

  document.querySelectorAll('[data-demo]').forEach(function (button) {
    var dialog = document.getElementById('demo-' + button.dataset.demo);
    if (!dialog) return;
    button.hidden = false;
    button.addEventListener('click', function () {
      dialog.showModal();
      if (!dialog.dataset.ready) {
        dialog.dataset.ready = '1';
        (button.dataset.demo === 'minirt' ? setUpRayTracer : setUpShell)(dialog);
      }
    });
    dialog.querySelector('[data-demo-close]').addEventListener('click', function () {
      dialog.close();
    });
    // A click on the backdrop (the dialog element itself, outside its content) closes it.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
  });

  // ---- miniRT -------------------------------------------------------------------------
  function setUpRayTracer(dialog) {
    var FRAMES = 24;
    var COLS = 6;
    var ROWS = 4;
    var stage = dialog.querySelector('.rt-stage');
    var slider = dialog.querySelector('.rt-slider');
    var line = dialog.querySelector('.rt-line');
    stage.style.backgroundImage = "url('" + stage.dataset.sprite + "')";

    function show(frame) {
      frame = ((frame % FRAMES) + FRAMES) % FRAMES;
      slider.value = frame;
      var col = frame % COLS;
      var row = Math.floor(frame / COLS);
      stage.style.backgroundPosition = (col * 100) / (COLS - 1) + '% ' + (row * 100) / (ROWS - 1) + '%';
      // The same scene-file line the frame was rendered from.
      var angle = (Math.PI * frame) / FRAMES;
      line.textContent =
        'cy 3,1,15 ' + Math.sin(angle).toFixed(2) + ',' + Math.cos(angle).toFixed(2) + ',0.00 2 6 0,0,255';
    }

    slider.addEventListener('input', function () {
      show(Number(slider.value));
    });

    var dragFrom = null;
    stage.addEventListener('pointerdown', function (event) {
      dragFrom = { x: event.clientX, frame: Number(slider.value) };
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', function (event) {
      if (!dragFrom) return;
      show(dragFrom.frame + Math.round((event.clientX - dragFrom.x) / 14));
    });
    ['pointerup', 'pointercancel'].forEach(function (name) {
      stage.addEventListener(name, function () {
        dragFrom = null;
      });
    });

    show(0);
  }

  // ---- minishell ----------------------------------------------------------------------
  function setUpShell(dialog) {
    var screen = dialog.querySelector('.msh-screen');
    var form = dialog.querySelector('.msh-form');
    var input = dialog.querySelector('.msh-input');
    var chips = dialog.querySelector('.msh-chips');
    var unknown = dialog.querySelector('.msh-unknown');
    var recorded = {};
    var lastStatus = 0;

    function print(text, className) {
      var row = document.createElement('div');
      if (className) row.className = className;
      row.textContent = text;
      screen.appendChild(row);
      screen.scrollTop = screen.scrollHeight;
    }

    function run(command) {
      command = command.trim();
      if (!command) return;
      print('minishell$ ' + command, 'msh-cmd');
      if (command === 'clear') {
        screen.textContent = '';
        return;
      }
      if (command === 'echo $?') {
        // What the shell prints here is the exit status of the previous command.
        print(String(lastStatus));
        lastStatus = 0;
        return;
      }
      var entry = recorded[command.replace(/\s+/g, ' ')];
      if (!entry) {
        print(unknown.textContent, 'msh-note');
        return;
      }
      if (entry.out) print(entry.out.replace(/\n$/, ''));
      lastStatus = entry.status;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      run(input.value);
      input.value = '';
    });

    fetch(screen.dataset.recording)
      .then(function (response) {
        return response.json();
      })
      .then(function (list) {
        list.forEach(function (entry) {
          recorded[entry.cmd.replace(/\s+/g, ' ')] = entry;
          var chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'msh-chip';
          chip.textContent = entry.cmd;
          chip.addEventListener('click', function () {
            run(entry.cmd);
            input.focus();
          });
          chips.appendChild(chip);
        });
        input.disabled = false;
        input.focus();
      })
      .catch(function () {
        print(unknown.textContent, 'msh-note');
      });
  }
})();
