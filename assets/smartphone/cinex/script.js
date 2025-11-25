// Toggle behavior for Doppio panel and arrow state
let savedPanelTemplate = null;
let savedSummaryForm = null;
document.addEventListener('DOMContentLoaded', function () {
    // Splash screen con fade in
    try {
        const body = document.body;
        const splash = document.createElement('div');
        splash.id = 'splash-screen';
        splash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        `;
        splash.innerHTML = `<img src="images/cinex_screen.jpg" alt="Cinex" style="width: 100%; height: 100%; object-fit: cover;">`;
        body.appendChild(splash);

        const showMainContent = () => {
            const mainContent = document.querySelector('.device');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.5s ease-in-out';
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
            }
        };
 
        // Forzar un reflow para asegurar que la transición se aplique
        void splash.offsetWidth;
 
        // 1. Iniciar el fade in
        splash.style.opacity = '1';
 
        // 2. Después de 2 segundos, iniciar el fade out del splash
        setTimeout(() => {
            splash.style.opacity = '0';
            // 3. Cuando el splash se desvanezca, mostrar el contenido principal y luego eliminar el splash
            splash.addEventListener('transitionend', () => {
                showMainContent();
                splash.remove();
            }, { once: true });
        }, 2000); // Duración total del splash screen visible
    } catch (err) {
        console.error('Error creating splash screen:', err);
        // Si hay un error con el splash, asegurarse de que el contenido principal se muestre
        showMainContent();
    }
    // Wrap header content in a div for better structure
	try {
		const header = document.querySelector('header');
		if (header) {
			const wrapper = document.createElement('div');
			wrapper.style.cssText = 'position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;padding: 20px 0px 0px 0px;';
			
			// Move all existing children from header to the new wrapper div
			while (header.firstChild) {
				wrapper.appendChild(header.firstChild);
			}
			
			// Append the new wrapper to the header
			header.appendChild(wrapper);
		}
	} catch (err) {
		console.error('Error wrapping header content:', err);
	}

	// Helper: if the activeElement is inside `el`, move focus to a safe target (readyBtn or body)
	function moveFocusIfInside(el, safeId) {
		try {
			if (!el) return;
			const active = document.activeElement;
			if (active && el.contains(active)) {
				const safe = (safeId && document.getElementById(safeId)) || document.getElementById('readyBtn') || document.body;
				// try to focus a safe element, otherwise blur the current
				if (safe && typeof safe.focus === 'function') {
					safe.focus();
				} else if (active && typeof active.blur === 'function') {
					active.blur();
				}
			}
		} catch (err) {
			// ignore focus errors
		}
	}

	// Helper to hide/show elements using inert when available, fallback to aria-hidden
	function setHidden(el, hidden) {
		if (!el) return;
		try {
			if ('inert' in HTMLElement.prototype) {
				el.inert = !!hidden;
				// keep aria-hidden for AT that don't understand inert
				if (hidden) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
			} else if ('inert' in el) {
				el.inert = !!hidden;
				if (hidden) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
			} else {
				// fallback to aria-hidden only
				el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
			}
		} catch (err) {
			// older browsers: fallback
			el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
		}
	}

	// Ensure form_5 header buttons exist and have working handlers.
	function ensureForm5HeaderHandlers() {
		try {
			const f5 = document.getElementById('form_5');
			const headerEl = document.querySelector('header');
			if (!headerEl) return;
			let f5b = document.getElementById('form5-backBtn');
			let f5c = document.getElementById('form5-contBtn');
			// create if missing
			if (!f5b) {
				f5b = document.createElement('button');
				f5b.id = 'form5-backBtn';
				f5b.type = 'button';
				f5b.textContent = 'Atras';
				headerEl.appendChild(f5b);
				f5b.style.display = 'block';
				try { setHidden(f5b, false); } catch (e) {}
			}
			if (!f5c) {
				f5c = document.createElement('button');
				f5c.id = 'form5-contBtn';
				f5c.type = 'button';
				f5c.textContent = 'Continuar';
				headerEl.appendChild(f5c);
				f5c.style.display = 'block';
				try { setHidden(f5c, false); } catch (e) {}
			}

			// attach handlers idempotently
			if (f5b && !f5b._bound) {
				f5b.addEventListener('click', function (e) {
					e && e.preventDefault && e.preventDefault();
					// close form_5
					try {
						const panel = document.getElementById('form_5');
						if (panel) {
							panel.classList.remove('in');
							setTimeout(() => { try { panel.parentNode && panel.parentNode.removeChild(panel); } catch (ex) {} }, 320);
						}
						// restore form_4 header buttons
						const hdrBack = document.getElementById('backBtn');
						const hdrCont = document.getElementById('continuarBtn');
						if (hdrBack) { hdrBack.style.display = hdrBack._prevDisplay || 'block'; try { setHidden(hdrBack, false); } catch (ex) {} }
						if (hdrCont) { hdrCont.style.display = hdrCont._prevDisplay || 'block'; try { setHidden(hdrCont, false); } catch (ex) {} }
						// remove form5 header buttons
						try { const fb = document.getElementById('form5-backBtn'); if (fb && fb.parentNode) fb.parentNode.removeChild(fb); const fc = document.getElementById('form5-contBtn'); if (fc && fc.parentNode) fc.parentNode.removeChild(fc); } catch (ex) {}
					} catch (err) { /* ignore */ }
				});
				f5b._bound = true;
			}

			if (f5c && !f5c._bound) {
				f5c.addEventListener('click', function (e) {
					e && e.preventDefault && e.preventDefault();
					// open form_6 using the same logic the code uses in-place
					if (document.getElementById('form_6')) return;
					try {
						const parentF5 = document.getElementById('form_5');
						if (!parentF5) return;
						const form6 = document.createElement('div');
						form6.id = 'form_6';
						form6.className = 'clone-detail-panel';
						form6.style.zIndex = 110;
						const f6inner = document.createElement('div');
						f6inner.className = 'form6-content';
						// 7 rows: 1=60px, 2=28px (separator style), 3=60px, 4=28px, 5=flex, 6=28px, 7=flex (duplicate of row5)
						// ensure border-radius matches form_5
						f6inner.style.cssText = 'width:100%;height:100%;box-sizing:border-box;background:rgba(255,255,255,0.98);padding:0;margin:0;display:grid;grid-template-rows:28px 80px 28px 95px 28px 1fr;border-radius:0px 0px 0 0;';
						// row 1 (main info) - darker subtle bg (rounded top corners)
						const f6r1 = document.createElement('div');
						f6r1.innerHTML = '<strong>Datos de la compra</strong>';
						f6r1.style.cssText = 'display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;justify-content:flex-start;';
						// row 2 (separator-like) - blue background
						const f6r2 = document.createElement('div');
						f6r2.style.cssText = 'padding:12px;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;background:rgba(0,0,0,0.08);font-size:0.85rem;';
						const col1_r2 = document.createElement('div');
						col1_r2.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
						col1_r2.innerHTML = '<div><strong>Pelicula:</strong></div><div><strong>Formato:</strong></div><div><strong>Cine:</strong></div>';
						f6r2.appendChild(col1_r2);
						const col2_r2 = document.createElement('div');
						col2_r2.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
						col2_r2.innerHTML = '<div><strong>Sala:</strong></div><div><strong>Fecha:</strong></div><div><strong>Hora:</strong></div>';
						f6r2.appendChild(col2_r2);
						// row 3 (info)
						const f6r3 = document.createElement('div');
						f6r3.innerHTML = '<strong>Datos de la tarjeta</strong>';
						f6r3.style.cssText = 'display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;justify-content:flex-start;';
						// row 4 (same as row 2)
						const f6r4 = document.createElement('div');
						f6r4.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items:center;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
						['Numero de Tarjeta:', 'CVV:', 'Vence:'].forEach(text => {
							const label = document.createElement('strong');
							label.textContent = text;
							const input = document.createElement('input');
							input.type = 'text';
							input.disabled = true; // Deshabilitar el input
							if (text === 'CVV:') input.style.width = '60px';
							else if (text === 'Vence:') input.style.width = '70px';
							else input.style.width = '100%';
							f6r4.appendChild(label);
							f6r4.appendChild(input);
						});
						// row 5 (flexible)
						const f6r5 = document.createElement('div');
						f6r5.innerHTML = '<strong>Datos personales</strong>';
						f6r5.style.cssText = 'display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;justify-content:flex-start;';
						// row 6 (same as row 2)
						const f6r6 = document.createElement('div');
						f6r6.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-content:start;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
						['Nombre:', 'Cedula:', 'e-mail:', 'tlf.:'].forEach(text => {
							const label = document.createElement('strong');
							label.textContent = text;
							const input = document.createElement('input');
							input.type = 'text';
							input.disabled = true; // Deshabilitar el input
							if (text === 'Cedula:') input.style.width = '80px';
							else if (text === 'e-mail:') input.style.width = '120px';
							else if (text === 'tlf.:') input.style.width = '100px';
							else input.style.width = '100%';
							f6r6.appendChild(label);
							f6r6.appendChild(input);
						});
						f6inner.appendChild(f6r1);
						f6inner.appendChild(f6r2);
						f6inner.appendChild(f6r3);
						f6inner.appendChild(f6r4);
						f6inner.appendChild(f6r5);
						f6inner.appendChild(f6r6);
						form6.appendChild(f6inner);
						parentF5.parentNode.insertBefore(form6, parentF5.nextSibling);
						// hide f5 header buttons while f6 active
						try { const f5bEl = document.getElementById('form5-backBtn'); const f5cEl = document.getElementById('form5-contBtn'); if (f5bEl) { f5bEl._prevDisplay = f5bEl.style.display; f5bEl.style.display='none'; try{ setHidden(f5bEl,true);}catch(e){} } if (f5cEl) { f5cEl._prevDisplay = f5cEl.style.display; f5cEl.style.display='none'; try{ setHidden(f5cEl,true);}catch(e){} } } catch(e){}
						// create form6 header buttons
						const headerEl2 = document.querySelector('header');
						let f6back = headerEl2 && document.getElementById('form6-backBtn');
						if (!f6back && headerEl2) { f6back = document.createElement('button'); f6back.id='form6-backBtn'; f6back.type='button'; f6back.textContent='Atras'; headerEl2.appendChild(f6back); f6back.style.display='block'; try{ setHidden(f6back,false);}catch(e){} }
						let f6cont = headerEl2 && document.getElementById('form6-contBtn');
						if (!f6cont && headerEl2) { f6cont = document.createElement('button'); f6cont.id='form6-contBtn'; f6cont.type='button'; f6cont.textContent='Continuar'; headerEl2.appendChild(f6cont); f6cont.style.display='block'; try{ setHidden(f6cont,false);}catch(e){} }
						void form6.offsetWidth; form6.classList.add('in');
						try { updateHeaderTitle(); } catch (e) { /* ignore */ }
						try { if (f6back && typeof f6back.focus === 'function') f6back.focus(); } catch (e) {}
						// wire f6 handlers via centralized helper
						try { ensureForm6Handlers(); } catch (e) {}
					} catch (err) { /* ignore */ }
				});
				f5c._bound = true;
			}
		} catch (err) { /* ignore */ }
	}

	// Observe DOM changes in the main device section and update header title accordingly.
	try {
		const deviceSection = document.querySelector('.device section') || document.body;
		const mo = new MutationObserver(function () {
			try { updateHeaderTitle(); } catch (e) { /* ignore */ }
		});
		mo.observe(deviceSection, { childList: true, subtree: true, attributes: true });
		// initial sync
		try { updateHeaderTitle(); } catch (e) { /* ignore */ }
	} catch (err) { /* ignore */ }

	// Ensure form_6 header buttons have handlers attached (idempotent)
	function ensureForm6Handlers() {
		try {
			console.debug('[ensureForm6Handlers] invoked');
			const f6c = document.getElementById('form6-contBtn');
			if (f6c && !f6c._bound) {
				f6c.addEventListener('click', function (e) {
					e && e.preventDefault && e.preventDefault();
					// "Listo" on form6 should close everything and go back to form_2
					try {
						// Find and remove all overlay forms
						['form_6', 'form_5', 'form_4', 'form_3'].forEach(id => {
							const form = document.getElementById(id);
							if (form) {
								form.classList.remove('in');
								setTimeout(() => {
									try { form.parentNode && form.parentNode.removeChild(form); } catch (err) {}
								}, 320);
							}
						});
						// Remove all temporary header buttons
						['form6-contBtn', 'form5-backBtn', 'form5-contBtn', 'continuarBtn'].forEach(id => {
							const btn = document.getElementById(id);
							if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
						});
						// Restore form_2 (the summary view)
						const form2 = document.getElementById('form_2');
						const backBtn = document.getElementById('backBtn');
						if (form2) setHidden(form2, false);
						if (backBtn) {
							backBtn.style.display = 'none';
							setHidden(backBtn, false);
							// No enfocar un botón que está oculto. El foco puede ir al body o a form_2.
						}
						// Restaurar el título del header a "Cartelera"
						try {
							const headerH1 = document.querySelector('header h1');
							if (headerH1) {
								const strong = headerH1.querySelector('strong');
								if (strong) strong.textContent = 'Cartelera';
								else headerH1.textContent = 'Cartelera';
							}
						} catch (err) { /* ignore */ }
								try { updateHeaderTitle(); } catch (e) { /* ignore */ }

					} catch (err) { /* ignore */ }
				});
				f6c._bound = true;
			}
		} catch (err) { /* ignore */ }
	}

	function hideEstrenosView() {
		const estrenosDiv = document.getElementById('estrenos');
		if (estrenosDiv && estrenosDiv.parentNode) {
			estrenosDiv.parentNode.removeChild(estrenosDiv);
		}
	}

	function hideCinesView() {
		const cinesDiv = document.getElementById('cines-view');
		if (cinesDiv && cinesDiv.parentNode) {
			cinesDiv.parentNode.removeChild(cinesDiv);
		}
	}

	function hideAccountView() {
		const accountDiv = document.getElementById('account');
		if (accountDiv && accountDiv.parentNode) {
			accountDiv.parentNode.removeChild(accountDiv);
		}
	}

	function hideFormatoView() {
		const formatoDiv = document.getElementById('formato');
		if (formatoDiv && formatoDiv.parentNode) {
			formatoDiv.parentNode.removeChild(formatoDiv);
		}
	}

	function hideAllHeaderButtons() {
		const buttonIds = [
			'readyBtn', 'backBtn', 'continuarBtn',
			'form5-backBtn', 'form5-contBtn',
			'form6-backBtn', 'form6-contBtn',
			'form7-backBtn', 'form7-contBtn'
		];
		buttonIds.forEach(id => {
			const btn = document.getElementById(id);
			if (btn) {
				btn.style.display = 'none';
			}
		});
	}

	// Central helper: actualizar el título del header según el formulario/overlay activo.
	// Reglas:
	// - Si `form_6` está presente y con clase `in` -> mostrar "Recibo".
	// - Si no, detectar el primer formulario/overlay visible de mayor prioridad
	//   (form_5 -> Pago, form_4 -> Boletos, form_3 -> Pelicula, form_2 -> Cartelera,
	//    account -> Ingresar, formato -> Formato, cines-view -> Cines, estrenos -> Estrenos)
	// - Si ninguno aplica, dejar el título por defecto ('Ciudad').
	function updateHeaderTitle() {
		function isVisible(el) {
			if (!el) return false;
			try {
				if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return false;
				if ('inert' in el && el.inert) return false;
				const rects = el.getClientRects && el.getClientRects();
				return !!(rects && rects.length);
			} catch (err) {
				return true; // be permissive on errors
			}
		}
		try {
			const headerH1 = document.querySelector('header h1');
			if (!headerH1) return;
			const setTitle = (t) => {
				const strong = headerH1.querySelector('strong');
				if (strong) strong.textContent = t; else headerH1.textContent = t;
			};

			const f6 = document.getElementById('form_6');
			if (f6 && f6.classList.contains('in')) { setTitle('Recibo'); return; }

			const f5 = document.getElementById('form_5');
			if (f5 && f5.classList.contains('in')) { setTitle('Pago'); return; }

			const f4 = document.getElementById('form_4');
			if (f4 && f4.classList.contains('in')) { setTitle('Boletos'); return; }

			const f3 = document.getElementById('form_3');
			if (f3 && f3.classList.contains('in')) { setTitle('Pelicula'); return; }

			const f2 = document.getElementById('form_2');
			if (f2 && isVisible(f2)) { setTitle('Cartelera'); return; }

			const accountEl = document.getElementById('account');
			if (accountEl && isVisible(accountEl)) { setTitle('Cuenta'); return; }
			const formatoEl = document.getElementById('formato');
			if (formatoEl && isVisible(formatoEl)) { setTitle('Formato'); return; }
			const cinesEl = document.getElementById('cines-view');
			if (cinesEl && isVisible(cinesEl)) { setTitle('Cines'); return; }
			const estrenosEl = document.getElementById('estrenos');
			if (estrenosEl && isVisible(estrenosEl)) { setTitle('Estrenos'); return; }

			// fallback
			setTitle('Ciudad');
		} catch (err) { /* ignore */ }
	}

	function showEstrenosView() {
		// Si la vista ya existe, no hacer nada.
		if (document.getElementById('estrenos')) return;
	
		// Ocultar otras vistas si están abiertas
		hideAccountView();
		hideCinesView();
		hideFormatoView();
		const form2 = document.getElementById('form_2');
		if (form2) setHidden(form2, true);

		// Ocultar todos los botones del header
		hideAllHeaderButtons();

		// Set header title
		try {
			const headerH1 = document.querySelector('header h1');
			if (headerH1) {
				const strong = headerH1.querySelector('strong');
				if (strong) strong.textContent = 'Estrenos'; else headerH1.textContent = 'Estrenos';
			}
		} catch (e) { /* ignore */ }
	
		const estrenosDiv = document.createElement('div');
		estrenosDiv.id = 'estrenos';
		estrenosDiv.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: white;
			z-index: 150;
			padding: 0.5rem;
			box-sizing: border-box;
			overflow-y: auto;
		`;
	
		const gridContainer = document.createElement('div');
		gridContainer.style.cssText = `
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem;
			width: 100%;
		`;
	
		const estrenosNames = [
			'The Revenant',
			'Brooklyn',
			'Cinderella',
			'Creed',
			'Crimson Peak',
			'Ex_Machina',
			'Sicario',
			'Spectre',
			'Spotlight',
			'Straight Outta Compton',
			'The Big Short',
			'The Hateful Eight'
		];

		const estrenosImages = [
			'images/estrenos/the_revenant.jpg',
			'images/estrenos/brooklyn.jpg',
			'images/estrenos/cinderella.jpg',
			'images/estrenos/creed.jpg',
			'images/estrenos/crimson_peak.jpg',
			'images/estrenos/ex_machina.jpg',
			'images/estrenos/sicario.jpg',
			'images/estrenos/spectre.jpg',
			'images/estrenos/spotlight.jpg',
			'images/estrenos/straight_outta_compton.jpg',
			'images/estrenos/the_big_short.jpg',
			'images/estrenos/the_hateful_eight.jpg'
		];

		for (let i = 0; i < 12; i++) { // 4 filas * 3 columnas = 12 items
			const cell = document.createElement('div');
			cell.style.cssText = `
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				gap: 0.5rem;
				text-align: center;
				font-size: 0.8rem;
				cursor: pointer;
				margin-bottom: 10px;
			`;
			// Add margin-top to the first row
			if (i < 3) {
				cell.style.marginTop = '10px';
			}

			const img = document.createElement('img');
			img.src = estrenosImages[i] || 'images/example.svg'; // Use premiere image or placeholder
			img.style.cssText = `
				width: 100%;
				height: auto;
				object-fit: cover;
				border-radius: 3px;
			`;
			const text = document.createElement('div');
			text.textContent = estrenosNames[i] || 'Lorem Ipsum';

			cell.appendChild(img);
			cell.appendChild(text);

			cell.addEventListener('click', () => {
				goToForm2();
			});

			gridContainer.appendChild(cell);
		}
	
		estrenosDiv.appendChild(gridContainer);
		document.querySelector('.device section').appendChild(estrenosDiv);
	}

	function showCinesView() {
		// Si la vista ya existe, no hacer nada.
		if (document.getElementById('cines-view')) return;

		// Ocultar otras vistas si están abiertas
		hideAccountView();
		hideEstrenosView();
		hideFormatoView();
		const form2 = document.getElementById('form_2');
		if (form2) setHidden(form2, true);
		// Ocultar también el formulario principal si está visible
		const mainForm = document.querySelector('form');
		if (mainForm) setHidden(mainForm, true);

		// Ocultar todos los botones del header
		hideAllHeaderButtons();

		// Set header title
		try {
			const headerH1 = document.querySelector('header h1');
			if (headerH1) {
				const strong = headerH1.querySelector('strong');
				if (strong) strong.textContent = 'Cines'; else headerH1.textContent = 'Cines';
			}
		} catch (e) { /* ignore */ }

		const cinesDiv = document.createElement('div');
		cinesDiv.id = 'cines-view';
		cinesDiv.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: white;
			z-index: 150;
			padding: 0.5rem;
			box-sizing: border-box;
			overflow-y: auto;
		`;

		const gridContainer = document.createElement('div');
		gridContainer.style.cssText = `
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
			width: 100%;
		`;

		const cinesNames = [
			'Cinex Buenaventura',
			'Cinex Tolón',
			'Cinex Sambil',
			'Cinex San Ignacio',
			'Cinex El Recreo',
			'Cinex Paseo El Hatillo',
			'Cinex Multiplaza El Paraiso',
			'Cinex Las Virtudes'
		];

		const cinesImages = [
			'images/cines/buenaventura.jpg',
			'images/cines/tolon.jpg',
			'images/cines/sambil.jpg',
			'images/cines/san_ignacio.jpg',
			'images/cines/recreo.jpg',
			'images/cines/paseo_el_hatillo.jpg',
			'images/cines/multiplaza_paraiso.jpg',
			'images/cines/las_virtudes.jpg'
		];

		for (let i = 0; i < 8; i++) { // 4 filas * 2 columnas = 8 items
			const cell = document.createElement('div');
			cell.style.cssText = `
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 0.5rem;
				text-align: center;
				font-size: 0.8rem;
				cursor: pointer;
				margin-bottom: 10px;
			`;
			// Add margin-top to the first row
			if (i < 2) {
				cell.style.marginTop = '10px';
			}

			const img = document.createElement('img');
			img.src = cinesImages[i % cinesImages.length] || 'images/example.svg'; // Use cinema image or placeholder
			img.style.cssText = `
				width: 100%;
				height: auto;
				object-fit: cover;
				border-radius: 3px;
			`;
			const text = document.createElement('div');
			text.textContent = cinesNames[i % cinesNames.length] || 'Lorem Ipsum';

			cell.appendChild(img);
			cell.appendChild(text);

			cell.addEventListener('click', () => {
				goToForm2();
			});

			gridContainer.appendChild(cell);
		}

		cinesDiv.appendChild(gridContainer);
		document.querySelector('.device section').appendChild(cinesDiv);
	}

	function showAccountView() {
		// Si la vista ya existe, no hacer nada.
		if (document.getElementById('account')) return;
	
		// Ocultar otras vistas si están abiertas
		hideCinesView();
		hideEstrenosView();
		hideFormatoView();
		const form2 = document.getElementById('form_2');
		if (form2) setHidden(form2, true);
	
		// Ocultar todos los botones del header
		hideAllHeaderButtons();

		// Set header title
		try {
			const headerH1 = document.querySelector('header h1');
			if (headerH1) {
				const strong = headerH1.querySelector('strong');
				if (strong) strong.textContent = 'Cuenta'; else headerH1.textContent = 'Cuenta';
			}
		} catch (e) { /* ignore */ }
	
		const accountDiv = document.createElement('div');
		accountDiv.id = 'account';
		// Apply styles from login project
		accountDiv.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #2c3338;
			z-index: 150;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: "Open Sans", sans-serif;
			color: #606468;
			overflow-y: hidden; /* Evitar la barra de desplazamiento vertical */
		`;
	
		// Replicate the structure from login/index.html
		accountDiv.innerHTML = `
			<style>
				#account .icon { height: 1em; display: inline-block; fill: #606468; width: 1em; vertical-align: middle; }
				#account .hidden { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
				#account input { background-image: none; border: 0; color: inherit; font: inherit; margin: 0; outline: 0; padding: 0; transition: background-color 0.3s; }
				#account input[type="submit"] { cursor: pointer; }
				#account .form { display: grid; gap: 0.875rem; }
				#account .form input[type="password"], #account .form input[type="text"], #account .form input[type="submit"] { width: 100%; }
				#account .form__field { display: flex; }
				#account .form__input { flex: 1; }
				#account .login { color: #eee; }
				#account .login label, #account .login input[type="text"], #account .login input[type="password"], #account .login input[type="submit"] { border-radius: 0.25rem; padding: 1rem; }
				#account .login label { background-color: #363b41; border-bottom-right-radius: 0; border-top-right-radius: 0; padding-left: 1.25rem; padding-right: 1.25rem; }
				#account .login input[type="password"], #account .login input[type="text"] { background-color: #3b4148; border-bottom-left-radius: 0; border-top-left-radius: 0; }
				#account .login input[type="password"]:focus, #account .login input[type="password"]:hover, #account .login input[type="text"]:focus, #account .login input[type="text"]:hover { background-color: #434a52; }
				#account .login input[type="submit"] { background-color: #005a96; color: #eee; font-weight: 700; text-transform: uppercase; }
				#account .login input[type="submit"]:focus, #account .login input[type="submit"]:hover { background-color: #d44179; }
				#account p { margin-top: 1.5rem; margin-bottom: 1.5rem; }
				#account .text--center { text-align: center; }
				#account a { color: #eee; outline: 0; text-decoration: none; }
				#account a:focus, #account a:hover { text-decoration: underline; }
			</style>
			<div class="grid" style="width: 90%; margin-left: auto; margin-right: auto; max-width: 20rem;">
				<form action="#" method="POST" class="form login">
					<div class="form__field">
						<label for="login__username">
							<svg class="icon" viewBox="0 0 1792 1792"><path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z"/></svg>
							<span class="hidden">Usuario</span>
						</label>
						<input autocomplete="username" id="login__username" type="text" name="username" class="form__input" placeholder="Usuario" required>
					</div>
					<div class="form__field">
						<label for="login__password">
							<svg class="icon" viewBox="0 0 1792 1792"><path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z"/></svg>
							<span class="hidden">Contraseña</span>
						</label>
						<input id="login__password" type="password" name="password" class="form__input" placeholder="Contraseña" required>
					</div>
					<div class="form__field">
						<input type="submit" value="Ingresar">
					</div>
				</form>
				<p class="text--center">¿No eres miembro? <a href="#">Regístrate</a> <svg class="icon" viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"/></svg></p>
			</div>
		`;
	
		document.querySelector('.device section').appendChild(accountDiv);

		// When the login form inside `#account` is submitted, open an independent overlay
		try {
			const loginForm = accountDiv.querySelector('form');
			if (loginForm) {
				loginForm.addEventListener('submit', function (ev) {
					ev && ev.preventDefault && ev.preventDefault();
					// avoid creating multiple overlays
					if (document.getElementById('account_2')) return;
					try {
						// create overlay panel (behaves like other clone-detail-panel overlays)
						const overlay = document.createElement('div');
						overlay.id = 'account_2';
						overlay.className = 'clone-detail-panel';
						overlay.style.zIndex = 160;

						// clone the visible content so the overlay is independent
						const innerClone = accountDiv.cloneNode(true);
						// set the clone container id to `account_2` so the existing CSS rules apply
						innerClone.id = 'account_2';
						// remove inline positioning styles from the cloned container so it is positioned by the overlay
						try { innerClone.removeAttribute('style'); } catch (e) {}

						// If the cloned content contains a <style> element with rules scoped to #account,
						// update those rules to target #account_2 so the visual appearance is preserved.
						try {
							const styleEl = innerClone.querySelector('style');
							if (styleEl && styleEl.textContent) {
								styleEl.textContent = styleEl.textContent.replace(/#account/g, '#account_2');
							}
						} catch (e) {}

						// suffix internal ids and update label 'for' attributes to avoid collisions
						Array.from(innerClone.querySelectorAll('[id]')).forEach(function (el) {
							const old = el.id;
							if (!old) return;
							const neu = old + '-2';
							el.id = neu;
						});
						Array.from(innerClone.querySelectorAll('label[for]')).forEach(function (lab) {
							const f = lab.getAttribute('for');
							if (f) lab.setAttribute('for', f + '-2');
						});

						// append the cloned content inside the overlay's detail-content wrapper
						const detailContent = document.createElement('div');
						detailContent.className = 'clone-detail-content';
						// Build 7 rows inside the detail content as requested
						// Row 1: centered text, square image, then another text below
						// Rows 2..7: simple rows; rows 2,4,6 have background color #27aae1
						try {
							for (let r = 1; r <= 7; r++) {
								const row = document.createElement('div');
								row.className = 'account2-row';
								// base styles for a row
								row.style.boxSizing = 'border-box';
								row.style.width = '100%';
								row.style.display = 'flex';
								row.style.alignItems = 'center';
								row.style.justifyContent = 'center';
								// alternate rows 2,4,6 color
								if (r === 2 || r === 4 || r === 6) {
									row.style.backgroundColor = '#27aae1';
									row.style.color = '#fff';
									// add class to enforce left alignment and other styles via CSS
									row.classList.add('sep');
								}

								if (r === 1) {
									// vertical stack: title, square image, subtitle
									const stack = document.createElement('div');
									stack.style.display = 'flex';
									stack.style.flexDirection = 'column';
									stack.style.alignItems = 'center';
									stack.style.gap = '8px';
									// top text
									const topText = document.createElement('div');
									topText.textContent = 'Cinex app';
									topText.style.fontWeight = '700';
									topText.style.fontSize = '1.1rem';
									topText.style.textAlign = 'center';
									topText.style.color = 'rgb(39, 170, 225)';
									// image square
									const img = document.createElement('img');
									img.src = 'images/cinex.jpg';
									img.alt = '';
									img.style.width = '120px';
									img.style.height = '120px';
									img.style.objectFit = 'cover';
									img.style.borderRadius = '6px';
									img.style.display = 'block';
									// bottom text
									const bottomText = document.createElement('div');
									bottomText.textContent = 'Version: 1.0.0';
									bottomText.style.fontSize = '0.95rem';
									bottomText.style.textAlign = 'center';
									bottomText.style.color = 'inherit';

									stack.appendChild(topText);
									stack.appendChild(img);
									stack.appendChild(bottomText);
									row.appendChild(stack);
								} else {
									// Row 2 should read 'Datos personales' (separator style)
									if (r === 2) {
										row.innerHTML = '<strong>Datos personales</strong>';
									}
									// Row 3: copy the exact structure of form_5's Row 5 (Personal info)
									else if (r === 3) {
										// create a form5-like row with grid of labels and inputs
										const form5Row = document.createElement('div');
										form5Row.className = 'form5-row row-5';
										form5Row.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items:center;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
										const personalLabels = ['Nombre:', 'Cedula:', 'e-mail:', 'tlf:'];
										personalLabels.forEach(text => {
											const label = document.createElement('strong');
											label.textContent = text;
											const input = document.createElement('input');
											input.type = 'text';
											if (text === 'Cedula:') {
												input.style.width = '80px';
											} else if (text === 'e-mail:') {
												input.style.width = '120px';
											} else if (text === 'tlf:') {
												input.style.width = '100px';
											} else {
												input.style.width = '160px';
											}
											form5Row.appendChild(label);
											form5Row.appendChild(input);
										});
											// append the specialized form5Row instead of the default row
											detailContent.appendChild(form5Row);
											// skip appending the generic row below
											continue;
									}
									else if (r === 4) {
											// separator matching form_5 row 2 text
											row.innerHTML = '<strong>Datos de la tarjeta</strong>';
									} else if (r === 6) {
										row.innerHTML = '<strong>Contacto</strong>';
									} else if (r === 7) {
										// Build the 'Desarrolladores' block as requested: strong header in #45b0e4
										while (row.firstChild) row.removeChild(row.firstChild);
										const container = document.createElement('div');
										container.style.display = 'flex';
										container.style.flexDirection = 'column';
										container.style.alignItems = 'center';
										container.style.justifyContent = 'center';
										container.style.gap = '12px';
										container.style.width = '100%';

										const header = document.createElement('strong');
										header.textContent = 'Desarrolladores';
										header.style.color = '#45b0e4';
										header.style.fontSize = '1rem';
										header.style.display = 'block';
										header.style.textAlign = 'center';

										const devsWrap = document.createElement('div');
										devsWrap.style.display = 'flex';
										devsWrap.style.flexDirection = 'column';
										devsWrap.style.alignItems = 'center';
										devsWrap.style.justifyContent = 'center';
										devsWrap.style.gap = '14px';

										const devList = [
											{ name: 'Bruce Wayne - Developer', email: 'b.wayne@gmail.com' },
											{ name: 'James Bond - webmaster', email: 'j.bond@gmail.com' },
											{ name: 'John Quintero - Graphic Designer', email: 'crejohndesign@gmail.com' }
										];

										devList.forEach(function (d) {
											const block = document.createElement('div');
											block.style.textAlign = 'center';
											block.style.lineHeight = '1.2';
											block.style.display = 'flex';
											block.style.flexDirection = 'column';
											block.style.alignItems = 'center';

											const nameDiv = document.createElement('div');
											nameDiv.textContent = d.name;
											nameDiv.style.marginBottom = '4px';

											const emailA = document.createElement('a');
											emailA.href = 'mailto:' + d.email;
											emailA.textContent = d.email;
											emailA.style.color = '#0000FF';
											emailA.style.textDecoration = 'underline';

											block.appendChild(nameDiv);
											block.appendChild(emailA);
											devsWrap.appendChild(block);
										});

										container.appendChild(header);
										container.appendChild(devsWrap);
										row.appendChild(container);
									} else {
										const txt = document.createElement('div');
										txt.textContent = 'Fila ' + r;
										txt.style.fontSize = '1rem';
										txt.style.textAlign = 'center';
										txt.style.color = 'inherit';
										row.appendChild(txt);
									}
								}
									// After building the generic row (except when we continued for r===3),
									// if this iteration corresponds to r===5 we need to replace the generic row
									// with the credit-card inputs (copy of form_5 row3).
									if (r === 5) {
										// Build an element that exactly matches form_5's Row 3 (credit card inputs)
										const form5Row3 = document.createElement('div');
										form5Row3.className = 'form5-row row-3';
										form5Row3.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items:center;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
										const cardLabels = ['Numero de Tarjeta:', 'CVV:', 'Vence:'];
										cardLabels.forEach(text => {
											const label = document.createElement('strong');
											label.textContent = text;
											const input = document.createElement('input');
											input.type = 'text';
											if (text === 'CVV:') {
												input.style.width = '60px';
											} else if (text === 'Vence:') {
												input.style.width = '70px';
											} else {
												input.style.width = '100%';
											}
											form5Row3.appendChild(label);
											form5Row3.appendChild(input);
										});
										// append the fully constructed form5 row and skip appending the generic `row`
										detailContent.appendChild(form5Row3);
										continue;
									}

								detailContent.appendChild(row);
							}
						} catch (e) {
							// fallback: if anything fails, append cloned children to avoid breaking the overlay
							Array.from(innerClone.childNodes).forEach(function (n) {
								detailContent.appendChild(n.cloneNode(true));
							});
						}

						overlay.appendChild(detailContent);
						// ensure the overlay spans the full width and aligns to the left
						try {
							overlay.style.left = '0';
							overlay.style.right = '0';
							overlay.style.width = '100%';
							overlay.style.padding = '0';
							// make the overlay content stretch to the full width instead of centering
							overlay.style.justifyContent = 'stretch';
							overlay.style.overflow = 'auto';

							// ensure detail content fills the overlay area (no horizontal offset)
							detailContent.style.width = '100%';
							detailContent.style.maxWidth = '100%';
							detailContent.style.boxSizing = 'border-box';
							detailContent.style.padding = '0.5rem';
						} catch (e) {}

						document.querySelector('.device section').appendChild(overlay);

						// animate in like other overlays (form_3 uses this sequence)
						void overlay.offsetWidth;
						overlay.classList.add('in');
						// make original account not interactive while overlay is open
						try { setHidden(accountDiv, true); accountDiv.style.pointerEvents = 'none'; } catch (e) {}
						// wire header back button to close the overlay and restore the original
						try {
							const headerBack = document.getElementById('backBtn');
							if (headerBack) {
								// save any previous handler so we can restore it
								headerBack._prevAccountOverlayHandler = headerBack._accountClickHandler || null;
								const removeOverlay = function (e) {
									if (e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
									overlay.classList.remove('in');
									setTimeout(function () {
										try { overlay.parentNode && overlay.parentNode.removeChild(overlay); } catch (er) {}
										try { setHidden(accountDiv, false); accountDiv.style.pointerEvents = ''; } catch (er) {}
										// restore previous back handler if any
										try {
											if (headerBack._prevAccountOverlayHandler) {
												headerBack.addEventListener('click', headerBack._prevAccountOverlayHandler);
											}
										} catch (er) {}
									}, 340);
									headerBack.removeEventListener('click', removeOverlay);
								};
								// remove prior stored handler (if set via other flows) to avoid duplication
								try { if (headerBack._prevAccountOverlayHandler) headerBack.removeEventListener('click', headerBack._prevAccountOverlayHandler); } catch (er) {}
								headerBack.addEventListener('click', removeOverlay);
								// keep a reference so other UI (footer icons) can also remove the overlay
								try { headerBack._accountOverlayRemover = removeOverlay; } catch (e) {}
							}
						} catch (er) {}
					} catch (err) { /* ignore overlay creation errors */ }
				});
			}
		} catch (err) { /* ignore */ }
	}

	// Close account_2 with the same animation but to the RIGHT when any footer icon is clicked
	try {
		const footerLinks = Array.from(document.querySelectorAll('.footer-link'));
		function closeAccount2ViaFooter() {
			const overlay = document.getElementById('account_2');
			if (!overlay) return;
			try {
				overlay.classList.remove('in');
			} catch (e) {}
			// restore original account if present
			try {
				const accountDiv = document.getElementById('account');
				if (accountDiv) { setHidden(accountDiv, false); accountDiv.style.pointerEvents = ''; }
			} catch (e) {}

			// If headerBack stored a remover, remove its listener
			try {
				const headerBack = document.getElementById('backBtn');
				if (headerBack && headerBack._accountOverlayRemover) {
					try { headerBack.removeEventListener('click', headerBack._accountOverlayRemover); } catch (er) {}
					headerBack._accountOverlayRemover = null;
				}
			} catch (e) {}

			// remove the overlay after the CSS transition (match 320ms used by panels)
			setTimeout(() => { try { overlay.parentNode && overlay.parentNode.removeChild(overlay); } catch (e) {} }, 340);
		}
		footerLinks.forEach(fl => {
			// attach but do not prevent default so existing footer behavior still runs
			fl.addEventListener('click', function () {
				closeAccount2ViaFooter();
			});
		});
	} catch (e) {}

	function showFormatoView() {
		// Si la vista ya existe, no hacer nada.
		if (document.getElementById('formato')) return;
	
		// Ocultar otras vistas si están abiertas
		hideAccountView();
		hideCinesView();
		hideEstrenosView();
		const form2 = document.getElementById('form_2');
		if (form2) setHidden(form2, true);

		// Ocultar todos los botones del header
		hideAllHeaderButtons();

		// Set header title
		try {
			const headerH1 = document.querySelector('header h1');
			if (headerH1) {
				const strong = headerH1.querySelector('strong');
				if (strong) strong.textContent = 'Formato'; else headerH1.textContent = 'Formato';
			}
		} catch (e) { /* ignore */ }
	
		const formatoDiv = document.createElement('div');
		formatoDiv.id = 'formato';
		formatoDiv.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: white;
			z-index: 150;
			padding: 1rem;
			box-sizing: border-box;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: 20px;
			align-items: center;
		`;
	
		// 2 filas con una imagen cada una, una para 3D y otra para 4DX
		const imageSources = ['images/3d.jpg', 'images/4dx.jpg'];
		imageSources.forEach(src => {
			const img = document.createElement('img');
			img.src = src;
			img.style.cssText = `
				width: 100%;
				max-width: 300px; /* O el ancho que prefieras */
				height: 200px;
				object-fit: contain;
				border-radius: 10px;
				cursor: pointer;
			`;
			// Al hacer clic en la imagen, navegar a la vista de Cartelera
			img.addEventListener('click', goToForm2);
			formatoDiv.appendChild(img);
		});
	
		document.querySelector('.device section').appendChild(formatoDiv);
	}

	function goToMainForm() {
		try {
			hideEstrenosView();
			hideCinesView();
			hideAccountView();
			hideFormatoView();
			// Cierra todos los formularios superpuestos (form_3 en adelante)
			['form_6', 'form_5', 'form_4', 'form_3'].forEach(id => {
				const form = document.getElementById(id);
				if (form) {
					form.classList.remove('in');
					setTimeout(() => {
						try { form.parentNode && form.parentNode.removeChild(form); } catch (err) {}
					}, 320);
				}
			});
	
			// Elimina todos los botones de encabezado temporales
			['form6-backBtn', 'form6-contBtn', 'form5-backBtn', 'form5-contBtn', 'continuarBtn'].forEach(id => {
				const btn = document.getElementById(id);
				if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
			});
	
			// Si form_2 (Cartelera) existe, lo eliminamos.
			const form2 = document.getElementById('form_2');
			if (form2 && form2.parentNode) {
				form2.parentNode.removeChild(form2);
				savedSummaryForm = null;
			}
	
			// Mostramos el formulario principal (el de Cines)
			const originalForm = document.querySelector('form');
			if (originalForm) {
				setHidden(originalForm, false);
				originalForm.style.display = '';
			}
	
			// Restauramos los botones del formulario principal
			handleBackAction();
	
			// Restaura el título del header a "Ciudad"
			const headerH1Strong = document.querySelector('header h1 strong');
			if (headerH1Strong) {
				headerH1Strong.textContent = 'Ciudad';
			}

		} catch (err) {
			console.error("Error in goToMainForm:", err);
		}
	}
	
	function goToForm2() {
		try {
			// Si hay formularios superpuestos (form_3 en adelante), ciérralos.
			['form_6', 'form_5', 'form_4', 'form_3'].forEach(id => {
				const form = document.getElementById(id);
				if (form) {
					form.classList.remove('in');
					setTimeout(() => {
						try { form.parentNode && form.parentNode.removeChild(form); } catch (err) {}
					}, 320);
				}
			});
			['form6-backBtn', 'form6-contBtn', 'form5-backBtn', 'form5-contBtn', 'continuarBtn', 'backBtn'].forEach(id => {
				const btn = document.getElementById(id);
				if (btn && btn.id !== 'backBtn') { // No eliminar el backBtn principal
					if (btn.parentNode) btn.parentNode.removeChild(btn);
				} else if (btn) {
					btn.style.display = 'none'; // Ocultar el backBtn si estaba visible
				}
			});

			// Si form_2 existe (incluso si está oculto), lo mostramos y salimos.
			const form2 = document.getElementById('form_2');
			if (form2) {
				hideEstrenosView();
				hideCinesView();
				hideAccountView();
				hideFormatoView();
				setHidden(form2, false);
				// Restore header to 'Cartelera'
				try {
					const headerH1 = document.querySelector('header h1');
					if (headerH1) {
						const strong = headerH1.querySelector('strong');
						if (strong) strong.textContent = 'Cartelera'; else headerH1.textContent = 'Cartelera';
					}
				} catch (e) { /* ignore */ }
				return;
			}
	
			// Si form_2 no existe, lo creamos desde cero.
			hideEstrenosView();
			hideCinesView();
			hideAccountView();
			hideFormatoView();
			// Asegurarse de que el formulario original esté visible para que el botón 'listo' funcione.
			const originalForm = document.querySelector('form');
			if (originalForm && originalForm.style.display === 'none') {
				originalForm.style.display = '';
			}

			// Simula el clic en el botón "Listo" para generar form_2
			const ready = document.getElementById('readyBtn');
			if (ready && !ready.disabled) {
				ready.click();
			}
		} catch (err) { console.error("Error in goToForm2:", err); }
	}

	const labels = Array.from(document.querySelectorAll('.city-labels label'));
	const radios = Array.from(document.querySelectorAll('input[name="Cities"]'));

		// Find an example panel to clone (type-panel template) if exists.
		// If there is no HTML template (we removed it to avoid duplicate placeholder rows),
		// create an in-memory template so the restore logic continues to work.
		let examplePanel = document.querySelector('.type-panel');
		if (!examplePanel) {
			examplePanel = document.createElement('div');
			examplePanel.className = 'type-panel';
			// the script will populate panel contents from data later; keep the template empty
			// and hidden by default when cloned/inserted via setHidden.
		}

	// Ensure each label has an associated panel immediately after it; if not, clone examplePanel or create empty panel
	labels.forEach(label => {
		const next = label.nextElementSibling;
		if (!next || !next.classList.contains('doppio-panel') && !next.classList.contains('type-panel')) {
			let panel;
			if (examplePanel) panel = examplePanel.cloneNode(true);
			else panel = document.createElement('div');
			panel.classList.remove('doppio-panel');
			panel.classList.add('type-panel');
			setHidden(panel, true);
			// clear id/classes from cloned panel rows if any
			labels[0].parentNode.insertBefore(panel, label.nextSibling);
		} else {
			// normalize class name
			if (next.classList.contains('doppio-panel')) {
				next.classList.remove('doppio-panel');
				next.classList.add('type-panel');
			}
		}
	});

	// Keep a snapshot of a panel template so we can restore panels after 'Listo' removes them
	if (examplePanel) {
		savedPanelTemplate = examplePanel.cloneNode(true);
		// normalize template: ensure it's not marked open/hidden so restored clones are interactive
		savedPanelTemplate.classList.remove('open');
		setHidden(savedPanelTemplate, false);
	}

	// Initialize ARIA state on all rows (ensure predictable starting state)
	const allRows = Array.from(document.querySelectorAll('.type-panel .row'));
	allRows.forEach(r => {
		if (!r.hasAttribute('tabindex')) r.setAttribute('tabindex', '0');
		if (!r.hasAttribute('aria-checked')) r.setAttribute('aria-checked', 'false');
		if (!r.hasAttribute('role')) r.setAttribute('role', 'checkbox');
	});

	// Generic click handler to toggle panels/radios (store handler reference so it can be removed later)
	labels.forEach(label => {
		const handler = function (e) {
			console.debug('[label handler attached] label=', label.getAttribute('for'));
			e.preventDefault();
			const forId = label.getAttribute('for');
			console.debug('[label click] forId=', forId);
			const radio = document.getElementById(forId);
			const panel = label.nextElementSibling && label.nextElementSibling.classList.contains('type-panel') ? label.nextElementSibling : null;
			console.debug('[label click] wasChecked radio=', radio && radio.checked, 'panelExists=', !!panel);
			if (!radio) return;
			const wasChecked = radio.checked;

			const labelsContainer = document.querySelector('.city-labels');
			const formEl = label.closest('form');

			if (wasChecked) {
				// collapse
				radio.checked = false;
				label.classList.remove('expanded');
				if (panel) {
					panel.classList.remove('open');
					// hide from AT and prevent focus inside
					setHidden(panel, true);
				}
				// nothing else to do when collapsing
			} else {
				// open this and close others
				radios.forEach(r => r.checked = false);
				document.querySelectorAll('.city-labels label.expanded').forEach(l => l.classList.remove('expanded'));
				document.querySelectorAll('.type-panel.open').forEach(p => p.classList.remove('open'));

				radio.checked = true;
				label.classList.add('expanded');
				if (panel) {
					// make panel available to AT and allow focus inside
					setHidden(panel, false);
					panel.classList.add('open');
				}
				// scroll the form so the opened panel is visible using the main form scrollbar
				if (panel && formEl) {
					// allow CSS class application then scroll
					setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
				}
			}
			// dispatch change for any existing listeners
			radio.dispatchEvent(new Event('change', { bubbles: true }));
		};
		label.addEventListener('click', handler);
		label._cityClickHandler = handler;
	});

	// Handle row selection (checkmark) inside any type-panel using event delegation
	const labelsNav = document.querySelector('.city-labels');
	if (labelsNav) {
		labelsNav.addEventListener('click', function (e) {
			const row = e.target.closest('.type-panel .row');
			if (!row) return;
			// toggle checked state
			row.classList.toggle('checked');
			// set ARIA state for accessibility
			const isChecked = row.classList.contains('checked');
			row.setAttribute('aria-checked', isChecked ? 'true' : 'false');
			// update ready button enabled state
			updateReadyButton();
		});

		// keyboard support: toggle with Enter or Space
		labelsNav.addEventListener('keydown', function (e) {
			const row = e.target.closest('.type-panel .row');
			if (!row) return;
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				row.classList.toggle('checked');
				row.setAttribute('aria-checked', row.classList.contains('checked') ? 'true' : 'false');
				// update ready button on keyboard toggle
				updateReadyButton();
			}
		});
	}

// Ready button enable/disable logic
function updateReadyButton() {
    const ready = document.getElementById('readyBtn');
    if (!ready) return;
    const anyChecked = !!document.querySelector('.type-panel .row.checked');
    ready.disabled = !anyChecked;
}

// ensure initial state on load
updateReadyButton();

// "Listo" button behavior: create an independent summary form, then collapse/remove panels from the original
const readyBtn = document.getElementById('readyBtn');
if (readyBtn) {
	readyBtn.addEventListener('click', function () {
		// if no selections, do nothing
		const anyChecked = document.querySelector('.type-panel .row.checked');
		if (!anyChecked) return;

		const originalForm = document.querySelector('form');

		// Guardar el estado de las filas seleccionadas antes de limpiar los paneles
		window._savedSelectedLocations = [];
		const checkedRows = document.querySelectorAll('.type-panel .row.checked');
		checkedRows.forEach(row => {
			window._savedSelectedLocations.push(row.textContent.trim());
		});

		// Si no hay selecciones, no hacer nada (aunque el botón debería estar deshabilitado)
		if (window._savedSelectedLocations.length === 0) {
			const anyChecked = document.querySelector('.type-panel .row.checked');
			if (!anyChecked) return;
		}


		window._savedRowSelections = {};
		// Guardar qué label/radio estaba expandido (si hay uno)
		window._savedExpandedFor = null;
		const expandedLabel = document.querySelector('.city-labels label.expanded');
		if (expandedLabel) window._savedExpandedFor = expandedLabel.getAttribute('for');
		labels.forEach(label => {
			const panel = label.nextElementSibling && label.nextElementSibling.classList.contains('type-panel') ? label.nextElementSibling : null;
			if (panel) {
				const rows = Array.from(panel.querySelectorAll('.row'));
				window._savedRowSelections[label.getAttribute('for')] = rows.map(row => row.classList.contains('checked'));
			}
		});

		// Create an independent CLONE of the entire original form so it's visually identical but separate
		if (originalForm && originalForm.parentNode) {
			// deep clone the form
			const clone = originalForm.cloneNode(true);

			// helper: append a suffix to all ids inside the clone and update label 'for' attributes
			const suffix = '-clone';
			const elementsWithId = clone.querySelectorAll('[id]');
			elementsWithId.forEach(el => {
				const oldId = el.getAttribute('id');
				const newId = oldId + suffix;
				el.setAttribute('id', newId);
			});
			// update labels inside the clone that reference ids via 'for'
			const labelsInClone = clone.querySelectorAll('label[for]');
			labelsInClone.forEach(l => {
				const oldFor = l.getAttribute('for');
				if (oldFor) l.setAttribute('for', oldFor + suffix);
			});

			// ensure the cloned form has its own buttons not interfering by ID
			const readyInClone = clone.querySelector('#readyBtn' + suffix) || clone.querySelector('#readyBtn');
			const backInClone = clone.querySelector('#backBtn' + suffix) || clone.querySelector('#backBtn');
			if (readyInClone) readyInClone.id = 'readyBtn' + suffix;
			if (backInClone) backInClone.id = 'backBtn' + suffix;

			// insert the clone after original and hide the original
			originalForm.parentNode.insertBefore(clone, originalForm.nextSibling);
			// identify the cloned form so it can be referenced separately
			clone.id = 'form_2';
			clone.setAttribute('data-form-id', 'form_2');
			// save reference to the cloned summary form for later removal
			savedSummaryForm = clone;
			// activate the Cartelera footer icon immediately when form_2 opens
			try { activateFooterByLabel('Cartelera'); } catch (err) { /* ignore */ }

			// show footer icons when the cloned summary form is visible
			try {
				const deviceEl = document.querySelector('.device');
				if (deviceEl) deviceEl.classList.add('show-footer-icons');
			} catch (err) { /* ignore */ }

			// --- Customization for cloned form: replace each label's inner text with a 3-column row (image | text | arrow) ---
			try {
				const clonedLabels = clone.querySelectorAll('.city-labels label');
				const coverImages = [
					'images/covers/avengers_ultron.jpg',
					'images/covers/intensa_mente.jpg',
					'images/covers/jurassic_world.jpg',
					'images/covers/mad_max.jpg',
					'images/covers/minions.jpg',
					'images/covers/mission_impossible_SN.jpg',
					'images/covers/pixels.jpg',
					'images/covers/the_visit.jpg'
				];


				// Keep only the first 8 labels and their corresponding inputs
				if (clonedLabels.length > 8) {
					for (let i = 8; i < clonedLabels.length; i++) {
						const labelToRemove = clonedLabels[i];
						const forId = labelToRemove.getAttribute('for');
						if (forId) {
							const radioToRemove = clone.querySelector(`#${forId}`);
							// Also remove the associated panel if it exists
							const panelToRemove = labelToRemove.nextElementSibling;
							if (panelToRemove && panelToRemove.classList.contains('type-panel')) {
								panelToRemove.remove();
							}
							if (radioToRemove) radioToRemove.remove();
						}
						labelToRemove.remove();
					}
				}
				// After removing extra labels, get the updated list
				const finalLabels = clone.querySelectorAll('.city-labels label');
				if (finalLabels.length > 0) {
					// Remove the bottom border from the last label to eliminate the extra line
					finalLabels[finalLabels.length - 1].style.borderBottom = 'none';
				}
				finalLabels.forEach((clonedLabel, index) => {
					try {
						// determine original label id by removing -clone suffix if present
						const forAttr = clonedLabel.getAttribute('for') || '';
						const originalId = forAttr.endsWith('-clone') ? forAttr.slice(0, -6) : forAttr;

						// remove existing inline spans/text nodes inside clone label
						Array.from(clonedLabel.querySelectorAll('span, .clone-left-content, .clone-row')).forEach(n => n.remove());

						// create left rect (image container)
						const leftRect = document.createElement('span');
						leftRect.className = 'clone-left-rect-6x3';
						leftRect.setAttribute('aria-hidden', 'true');

						// get image src from original label if available
						const originalLabel = document.querySelector('label[for="' + originalId + '"]');
						const imgSrc = originalLabel && originalLabel.getAttribute('data-img-src');
						if (coverImages[index]) {
							const img = document.createElement('img');
							img.setAttribute('src', coverImages[index]);
							img.setAttribute('alt', '');
							leftRect.appendChild(img);
						} else {
							// Usar la imagen de ejemplo como placeholder
							const img = document.createElement('img');
							img.setAttribute('src', 'images/example.svg');
							img.setAttribute('alt', 'placeholder');
							leftRect.appendChild(img);
						}

						// create the row container (3 columns)
						const row = document.createElement('div');
						row.className = 'clone-row';

						// create the text element: use configured movie titles for the cloned labels
						const textEl = document.createElement('div');
						textEl.className = 'clone-left-text';
						const movieTitles = [
							'Avengers: Age of Ultron',
							'Inside Out',
							'Jurassic World',
							'Mad Max: Fury Road',
							'Minions',
							'Mission: Impossible - Rogue Nation',
							'Pixels',
							'The Visit'
						];
						textEl.textContent = movieTitles[index] || 'Movie Title';

						// create arrow element
						const arrowEl = document.createElement('span');
						arrowEl.className = 'clone-arrow';
						arrowEl.setAttribute('aria-hidden', 'true');
						arrowEl.textContent = '>';

						// assemble row
						row.appendChild(leftRect);
						row.appendChild(textEl);
						row.appendChild(arrowEl);

						// hide the original pseudo-arrow for this cloned label
						clonedLabel.classList.add('no-pseudo-arrow');

						// insert row as the first child of the cloned label
						clonedLabel.insertBefore(row, clonedLabel.firstChild);
					} catch (innerErr) {
						console.debug('[clone customization] error customizing cloned label', innerErr);
					}
				});
			} catch (err) {
				console.debug('[clone customization] error customizing cloned labels', err);
			}
			// Make .clone-row inside the cloned form clickable and keyboard-accessible
			try {
				// Delegate clicks inside the cloned form to the corresponding label/input
				clone.addEventListener('click', function (ev) {
					const row = ev.target.closest && ev.target.closest('.clone-row');
					if (!row) return;
					const lbl = row.closest('label');
					if (!lbl) return;
					const forId = lbl.getAttribute('for');

					// prevent double-activation while animating
					if (clone._animatingCloneRows) return;

					// NOTE: original behavior animated clone rows to the left by adding
					// the `clone-rows-hidden` class. That produced an unwanted slide
					// animation of the cloned summary (`form_2`). To disable that left
					// animation while preserving the rest of the flow, we keep the
					// _animatingCloneRows guard but do NOT add the class that triggers
					// the CSS transform/transition.
					clone._animatingCloneRows = true;

					const allRows = Array.from(clone.querySelectorAll('.clone-row'));
					const rowIndex = allRows.indexOf(row);
					const doAfterAnimation = () => {
						try {
							// create an independent detail screen (form_3) that overlays the UI
							// We DO NOT slide the original clone/form_2; we leave it in place so its
							// vertical scrollbar remains visible and fixed. form_3 is an overlay
							// that animates in from the right.
							const detail = document.createElement('div');
							detail.className = 'clone-detail-panel';
							detail.id = 'form_3';
							detail.style.zIndex = 75; // Above form_2
							detail.setAttribute('data-form-id', 'form_3');

							const detailContent = document.createElement('div');
							detailContent.className = 'clone-detail-content';

							// duplicate the row (leftRect + text) inside the detail content
							const dup = row.cloneNode(true);
							// remove arrow if present
							const dupArrow = dup.querySelector('.clone-arrow');
							if (dupArrow) dupArrow.parentNode && dupArrow.parentNode.removeChild(dupArrow);
							// make sure the duplicated elements are visible
							dup.classList.remove('checked');
							dup.setAttribute('role', 'group');
							// Forzar la imagen a 'no seleccionada' en form_3
							try {
								const leftRect = dup.querySelector('.clone-left-rect-6x3');
								if (leftRect) {
									// Eliminar cualquier imagen previa
									while (leftRect.firstChild) {
										leftRect.removeChild(leftRect.firstChild);
									}
									// Obtener la imagen de la fila original de form_2 y usarla en form_3
									const originalImg = row.querySelector('.clone-left-rect-6x3 img');
									const imgSrc = originalImg ? originalImg.src : 'images/example.svg';
									const img = document.createElement('img');
									img.setAttribute('src', imgSrc);
									img.setAttribute('alt', 'Poster de la película');
									leftRect.appendChild(img);
									// Hacer la imagen interactiva
									leftRect.style.pointerEvents = 'auto';
									leftRect.setAttribute('tabindex', '0');
									leftRect.setAttribute('role', 'button');
									leftRect.addEventListener('click', function (e) {
										e.stopPropagation();
										e.preventDefault();
										try {
											if (forId) {
												const target = document.getElementById(forId);
												if (target && typeof target.click === 'function') target.click();
												else if (lbl) lbl.click();
											}
										} catch (err) { /* ignore */ }
									});
									leftRect.addEventListener('keydown', function (e) {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											leftRect.click();
										}
									});
								}
								// make the whole duplicated row inert to pointer events, then enable only the image
								try { dup.style.pointerEvents = 'none'; } catch (e) {}
								const leftText = dup.querySelector('.clone-left-text');
								if (leftText) {
									leftText.style.pointerEvents = 'none';
									leftText.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); });
									leftText.addEventListener('keydown', function (e) { e.stopPropagation(); });
								}
								// Modificar el texto "lorem ipsum" y añadir la información adicional.
								try {
									const textContainer = dup.querySelector('.clone-left-text');
									if (textContainer) {
										// Envolver el texto principal en un span para reducir su tamaño mínimamente y mantenerlo en negrita.
										const mainText = textContainer.textContent;
										textContainer.innerHTML = `<strong style="font-size: 1em; text-transform: none;">${mainText}</strong>`;

										// Añadir la información adicional debajo.
										const extraInfo = document.createElement('div');
										extraInfo.className = 'clone-extra-info';
										// Estilo para la información adicional.
										extraInfo.style.cssText = 'font-size: 0.8em; margin-top: 12px; line-height: 1.1; text-transform: none; font-weight: bolder;';
										extraInfo.innerHTML = `
											Género: <br>
											Censura: <br>
											Duración: <br>
											Estreno:
										`;
										textContainer.appendChild(extraInfo);
									}
								} catch(err) { /* ignorar */ }
							} catch (err) { /* ignore */ }
							detailContent.appendChild(dup);

						// create a vertical rows container and place detailContent as the FIRST row
						const bottom = document.createElement('div');
						bottom.className = 'clone-detail-bottom';

						// FIRST row: keep the existing .clone-detail-content intact and as-is
						bottom.appendChild(detailContent);

						// SECOND row: 3 columns
						const row1 = document.createElement('div');
						row1.className = 'cdb-row cdb-row-3cols';
						// Personalizar los textos de las columnas
						const colTexts = ['Hoy', '24/10/15', '25/10/15'];
						for (let i = 0; i < 3; i++) {
							const col = document.createElement('div');
							col.className = 'cdb-col';
							col.textContent = colTexts[i];
							row1.appendChild(col);
						}

						// make columns interactive: center text already handled via CSS
						const cols = Array.from(row1.querySelectorAll('.cdb-col'));
						cols.forEach((col, idx) => {
							col.setAttribute('tabindex', '0');
							col.setAttribute('role', 'button');
							// initialize first column as active
							if (idx === 0) col.classList.add('active');
							col.addEventListener('click', function (e) {
								e.stopPropagation();
								const wasActive = col.classList.contains('active');
								// toggle active class: ensure only one active at a time
								cols.forEach(c => c.classList.remove('active'));
								col.classList.add('active');

								// Si se hizo clic en un botón que no estaba activo, actualizar el grid.
								if (!wasActive) {
									try {
										const grid = document.querySelector('#form_3 .cdb-grid');
										if (grid) {
											// Aplicar un efecto de "parpadeo" para simular la actualización.
											grid.style.transition = 'opacity 0.15s ease-in-out';
											grid.style.opacity = '0.5';
											setTimeout(() => {
												// Aquí se podría cargar data nueva. Por ahora, solo restauramos la opacidad.
												grid.style.opacity = '1';
											}, 150);
										}
									} catch (err) { /* ignorar */ }
								}
							});
							col.addEventListener('keydown', function (e) {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									col.click();
								}
							});
						});

						// THIRD row: replace textarea with a grid div (2 columns x 6 rows)
						const row2 = document.createElement('div');
						row2.className = 'cdb-row cdb-row-single';

						const grid = document.createElement('div');
						grid.className = 'cdb-grid';
						// Adjust grid-template-rows to include a top info row plus separator rows (1px)
						// We have 6 content rows; add a 1px separator after each content row except the last
						try {
							const contentRows = 6;
							// start with a top row (auto height) followed by content rows with separators
							let templateRows = 'auto ';
							for (let ri = 0; ri < contentRows; ri++) {
								templateRows += '1fr';
								// use 'auto' for separator rows (we'll render them as full div rows with text)
								if (ri !== contentRows - 1) templateRows += ' auto ';
							}
							// normalize spacing
							grid.style.gridTemplateRows = templateRows.trim().replace(/\s+/g, ' ');
						} catch (err) {
							// if anything goes wrong, fall back to CSS default
						}

						// Create a top info row that spans both columns: background #005a96 and right-aligned strong text
						try {
							const topRow = document.createElement('div');
							topRow.className = 'cdb-grid-toprow';
							// ensure it spans both grid columns
							topRow.style.gridColumn = '1 / -1';
							topRow.style.backgroundColor = '#005a96';
							topRow.style.color = '#fff';
							topRow.style.display = 'flex';
							topRow.style.alignItems = 'center';
							// align text to the LEFT as requested
							topRow.style.justifyContent = 'flex-start';
							topRow.style.padding = '0 12px';
							topRow.style.height = '28px';
							const topStrong = document.createElement('strong');
							topStrong.textContent = 'Texto aqui';
							topRow.appendChild(topStrong);
							grid.appendChild(topRow);
						} catch (err) { /* ignore top row creation errors */ }
						// create 12 cells (2 columns * 6 rows)
						// Try to read labels from the originating label element so they can be edited in HTML
						let cellLabels = [];
						// Get selected locations to create the grid rows
						const selectedLocations = window._savedSelectedLocations || [];
						const numRowsToCreate = Math.max(1, selectedLocations.length); // Create at least one row

						try {
							// Option A: JSON array in data-grid attribute on the label
							const dataAttr = lbl && lbl.getAttribute && lbl.getAttribute('data-grid');
							if (dataAttr) {
								try { cellLabels = JSON.parse(dataAttr); } catch (err) { cellLabels = []; }
							}
							// Option B: fallback to hidden .grid-source spans inside the label
							if ((!cellLabels || cellLabels.length === 0) && lbl) {
								const source = lbl.querySelector && lbl.querySelector('.grid-source');
								if (source) {
									const spans = Array.from(source.querySelectorAll('span'));
									if (spans && spans.length) cellLabels = spans.map(s => s.textContent.trim());
								}
							}
						} catch (err) {
							cellLabels = [];
						}

						// Build 6 rows: left cell (editable text) and right cell (image + editable caption)
						for (let rowIndex = 0; rowIndex < numRowsToCreate; rowIndex++) {
							// LEFT column cell (editable)
							const leftCell = document.createElement('div');
							leftCell.className = 'cdb-grid-cell cdb-grid-left';
							leftCell.setAttribute('aria-label', 'Left column item ' + (rowIndex + 1));
							// Create 6 small action buttons arranged in 3 rows x 2 cols for EVERY left cell
							// The button labels can be provided from HTML in two ways (priority order):
							// 1) JSON in the originating label's `data-btns` attribute. This can be either
							//    - an array of 6 strings (applies to all rows), or
							//    - an array of 6-element arrays (one array per row) and we pick the one for current rowIndex.
							// 2) Hidden `.btn-source` spans inside the originating label (one span per button) grouped per row
							// If none provided, fallback to numeric labels 1..6.
							let btnLabelsForRow = null;
							try {
								// try JSON data attribute on the originating label (lbl variable in outer scope)
								const rawBtns = lbl && lbl.getAttribute && lbl.getAttribute('data-btns');
								if (rawBtns) {
									const parsed = JSON.parse(rawBtns);
									if (Array.isArray(parsed)) {
										// if nested arrays, try to select the row-specific array
										if (parsed.length > 0 && Array.isArray(parsed[0]) && parsed[rowIndex] && Array.isArray(parsed[rowIndex])) {
											btnLabelsForRow = parsed[rowIndex];
										} else if (parsed.length >= 6 && typeof parsed[0] === 'string') {
											btnLabelsForRow = parsed.slice(0, 6);
										}
									}
								}
							} catch (err) {
								btnLabelsForRow = null;
							}
							if (!btnLabelsForRow) {
								// try `.btn-source` spans inside the original label (six spans expected)
								try {
									const btnSourceContainer = lbl && lbl.querySelector && lbl.querySelector('.btn-source');
									if (btnSourceContainer) {
										const spans = Array.from(btnSourceContainer.querySelectorAll('span'));
										// if there are 6 spans, use them for all rows; if there are 6*6 spans, pick the block for this row
										if (spans.length === 6) btnLabelsForRow = spans.map(s => s.textContent.trim());
										else if (spans.length === 36) {
											btnLabelsForRow = spans.slice(rowIndex * 6, rowIndex * 6 + 6).map(s => s.textContent.trim());
										}
									}
								} catch (err) { /* ignore */ }
							}
							// fallback to defaults
							if (!btnLabelsForRow || !Array.isArray(btnLabelsForRow) || btnLabelsForRow.length < 6) {
								// Default times for buttons across all rows when no HTML configuration is provided
								btnLabelsForRow = ['9:00am', '12:30pm', '2:30pm', '4:30pm', '6:30pm', '8:30pm'];
							}

							const leftBtnGrid = document.createElement('div');
							leftBtnGrid.className = 'cdb-left-btn-grid';
							for (let r = 0; r < 3; r++) {
								const rowDiv = document.createElement('div');
								rowDiv.className = 'cdb-left-btn-row';
								for (let c = 0; c < 2; c++) {
									const idxBtn = r * 2 + c;
									const btn = document.createElement('button');
									btn.type = 'button';
									btn.className = 'cdb-small-btn';
									btn.setAttribute('aria-label', 'Action ' + (idxBtn + 1));
									const originalLabel = btnLabelsForRow[idxBtn] || (idxBtn + 1).toString();
									// store original label so we can restore it when toggling
									btn.dataset.originalLabel = originalLabel;
									btn.textContent = originalLabel;
									// click handler: toggle purchased state (green Comprar <-> original)
									btn.addEventListener('click', function (e) {
										e.stopPropagation();
										e.preventDefault();
										try {
											// if currently processing, cancel processing and revert to purchased state
											if (btn.classList.contains('processing')) {
												// clear any processing timeout if present
												if (btn._processingTimeout) {
													clearTimeout(btn._processingTimeout);
													btn._processingTimeout = null;
												}
												btn.classList.remove('processing');
												btn.classList.add('purchased');
												btn.innerHTML = '<strong>Comprar</strong>';
												btn.setAttribute('aria-pressed', 'true');
												return;
											}

											const isPurchased = btn.classList.contains('purchased');
											if (isPurchased) {
												// revert to original
												btn.classList.remove('purchased');
												btn.innerHTML = btn.dataset.originalLabel || originalLabel;
												btn.setAttribute('aria-pressed', 'false');
											} else {
												// Antes de poner este botón como 'purchased',
												// buscar cualquier otro botón que ya lo esté y revertirlo.
												try {
													const form3 = document.getElementById('form_3');
													if (form3) {
														const allPurchasedButtons = form3.querySelectorAll('.cdb-small-btn.purchased');
														allPurchasedButtons.forEach(otherBtn => {
															if (otherBtn !== btn) { // No revertir el botón actual
																otherBtn.classList.remove('purchased');
																otherBtn.innerHTML = otherBtn.dataset.originalLabel || '';
																otherBtn.setAttribute('aria-pressed', 'false');
															}
														});
													}
												} catch (err) { /* ignore */ }

												// Ahora, establecer el botón actual como 'purchased'
												btn.classList.add('purchased');
												btn.innerHTML = '<strong>Comprar</strong>';
												btn.setAttribute('aria-pressed', 'true');
											}
										} catch (err) { /* ignore */ }
									});

									// long-press (2s) handling: when button is in purchased state and user holds for 2s,
									// enter 'processing' animation: opaque green, spinner icon and text 'Procesando'.
									(function attachLongPress(btnRef) {
										let pressTimer = null;
										// helpers to manage global no-hscroll state (counting to support concurrent processing)
										function addProcessingLock() {
											try {
												window._processingLongPressCount = (window._processingLongPressCount || 0) + 1;
												if (window._processingLongPressCount === 1) document.body.classList.add('no-hscroll');
											} catch (e) {}
										}
										function removeProcessingLock() {
											try {
												window._processingLongPressCount = Math.max(0, (window._processingLongPressCount || 0) - 1);
												if (!window._processingLongPressCount) document.body.classList.remove('no-hscroll');
											} catch (e) {}
										}

										// start the long-press timer only if the button is already purchased
										function startPress(e) {
											try {
												// ignore right-click/contextmenu
												if (e && e.button === 2) return;
												// only when currently purchased
												if (!btnRef.classList.contains('purchased')) return;
												// start 1s timer for long-press
												if (pressTimer) clearTimeout(pressTimer);
												pressTimer = setTimeout(() => {
													// begin processing state
													try {
														btnRef.classList.add('processing');
														addProcessingLock();
														btnRef.innerHTML = "<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";
														btnRef.setAttribute('aria-pressed', 'true');
														// Spinner animation: 1 segundo, luego mostrar form_4
														if (btnRef._processingTimeout) clearTimeout(btnRef._processingTimeout);
														btnRef._processingTimeout = setTimeout(() => {
															try {
																btnRef.classList.remove('processing');
																btnRef.classList.add('purchased');
																btnRef.innerHTML = '<strong>Comprar</strong>';
																btnRef.setAttribute('aria-pressed', 'true');
																btnRef._processingTimeout = null;
																removeProcessingLock();
																// Mostrar form_4 animado tras 1 segundo
																const form3 = document.getElementById('form_3');
																if (form3 && !document.getElementById('form_4')) {
																	const form4 = document.createElement('div');
																	form4.id = 'form_4';
																	form4.className = 'clone-detail-panel';
																	// Build inner content (confirmation) - header back button will live in the page header
																	const form4Inner = document.createElement('div');
																	// build grid rows so separator rows (2,4,6) are fixed height (28px)
																	const rows = [];
																	for (let r = 1; r <= 8; r++) {
																		// separadores fijos a 28px; filas 1,3,5,7 reducidas a 60px
																		if (r === 1) rows.push('40px'); // Altura reducida para la primera fila
																		else if (r === 2 || r === 4 || r === 6) rows.push('28px');
																		else if (r === 3 || r === 5 || r === 7) rows.push('50px'); // Altura reducida
																		else rows.push('auto');
																	}
																	form4Inner.style.cssText = 'width:290px;height:100%;max-width:none;background:rgba(0,0,0,0.08);border-radius:8px;padding:0;margin:0;display:grid;';
																	form4Inner.style.gridTemplateRows = rows.join(' ');
																	                                                                const updateTotals = () => {
																																				const form4 = document.getElementById('form_4');
																																				if (!form4) return;

																																				const precios = { ninos: 70, adultos: 100, terceraEdad: 50 };
																																				const ivaUnitario = 16;

																																				const cantNinos = parseInt(form4.querySelector('#counter-ninos')?.textContent || '0', 10);
																																				const cantAdultos = parseInt(form4.querySelector('#counter-adultos')?.textContent || '0', 10);
																																				const cantTerceraEdad = parseInt(form4.querySelector('#counter-tercera-edad')?.textContent || '0', 10);

																																				const totalBoletos = cantNinos + cantAdultos + cantTerceraEdad;

																																				const subtotalNinos = cantNinos * precios.ninos;
																																				const subtotalAdultos = cantAdultos * precios.adultos;
																																				const subtotalTerceraEdad = cantTerceraEdad * precios.terceraEdad;

																																				const subtotal = subtotalNinos + subtotalAdultos + subtotalTerceraEdad;
																																				const ivaTotal = totalBoletos * ivaUnitario;
																																				const totalPagar = subtotal + ivaTotal;

																																				const cantidadBoletosEl = form4.querySelector('#cantidad-boletos');
																																				const precioBoletoEl = form4.querySelector('#precio-boleto');
																																				const subtotalEl = form4.querySelector('#subtotal');
																																				const ivaTotalEl = form4.querySelector('#iva-total');
																																				const aPagarEl = form4.querySelector('#a-pagar');
																																				const totalEl = form4.querySelector('#total');

																																				if (cantidadBoletosEl) cantidadBoletosEl.textContent = totalBoletos;
																																				if (precioBoletoEl) precioBoletoEl.textContent = `Bs. ${subtotal}`;
																																				if (subtotalEl) subtotalEl.textContent = `Bs. ${subtotal}`;
																																				if (ivaTotalEl) ivaTotalEl.textContent = `Bs. ${ivaTotal}`;
																																				if (aPagarEl) aPagarEl.textContent = `Bs. ${totalPagar}`;
																																				if (totalEl) totalEl.textContent = `Bs. ${totalPagar}`;
																																			};
																	
																	                                                                const updateAsientosDisponibles = () => {
																	                                                                    const form4 = document.getElementById('form_4');
																	                                                                    if (!form4) return;
																	                                                                
																	                                                                    let totalBoletos = 0;
																	                                                                    const counters = form4.querySelectorAll('.split-wrap-value');
																	                                                                    counters.forEach(counter => {
																	                                                                        totalBoletos += parseInt(counter.textContent, 10) || 0;
																	                                                                    });
																	                                                                
																	                                                                    const asientosDisponiblesEl = form4.querySelector('#asientos-disponibles');
																	                                                                    if (asientosDisponiblesEl) {
																	                                                                        const asientosDisponibles = 78 - totalBoletos;
																	                                                                        asientosDisponiblesEl.textContent = `${asientosDisponibles}/78`;
																	                                                                    }
																	                                                                };
																	
																	for(let i=1;i<=8;i++){
																	    const fila=document.createElement('div');
																	    fila.className='form4-row';
																	    // base styles for rows
																	    fila.style.cssText='width:100%;height:100%;border-bottom:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:16px;background:rgba(255,255,255,0.15);padding:0 1rem;box-sizing:border-box;';
																	    if(i===1){
																	                                                                        // Primera fila: Asientos disponibles en strong y el resultado 78/78
																	                                                                                fila.innerHTML = '<strong>Asientos disponibles:</strong>&nbsp;<span id="asientos-disponibles" class="asientos">78/78</span>';						        // ensure left alignment for this row
																	        fila.style.justifyContent = 'flex-start';
																	    } else if (i===2 || i===4 || i===6) {
																	        // Filas 2, 4 y 6: adaptar su estilo para que coincida con el separator
																	        // usado en form_3, pero SIN crear una nueva combinación de clases.
																	        // Mantener solo la clase 'form4-row' y aplicar estilos idénticos.
																	        fila.className = 'form4-row';
																	        // use new separator color requested for rows 2/4/6
																	        fila.style.backgroundColor = '#27aae1';
																	        fila.style.color = '#fff';
																	        fila.style.display = 'flex';
																	        fila.style.alignItems = 'center';
																	        fila.style.justifyContent = 'flex-start';
																	        fila.style.padding = '0 12px';
																	        fila.style.height = '28px';
																	        fila.style.fontSize = '1rem';
																	        fila.style.boxSizing = 'border-box';
																	        // texto a la izquierda (igual que el sep de form_3)
																	        if (i === 2) fila.innerHTML = '<strong>Niños</strong>';
																	        else if (i === 4) fila.innerHTML = '<strong>Adultos</strong>';
																	        else if (i === 6) fila.innerHTML = '<strong>3ra Edad</strong>';
																	    } else if (i===3 || i===5 || i===7) {
																	        // Filas 3, 5 y 7: deben tener 3 columnas cada una.
																	        // Creamos un grid interno de 3 columnas y añadimos contenido de ejemplo.
																	        fila.style.display = 'block';
																	        fila.style.padding = '0px';
																	        fila.style.background = 'rgba(255,255,255,0.06)';
																	        // inner grid
																	        const innerGrid = document.createElement('div');
																	        innerGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;height:100%;align-items:center;padding: 0px 10px 0px 10px;';
																	        for (let c = 1; c <= 3; c++) {
																	            const col = document.createElement('div');
																	            col.className = 'form4-col';
																	            col.style.cssText = 'display:flex;align-items:center;justify-content:flex-start;font-size:1rem;';
																	            if (c === 1) {
																	                // columna 1: mostrar Precio: y IVA: en strong, cada uno en su línea
																	                col.innerHTML = '<div style="line-height:1.1"><strong style="font-size: 0.85rem;">Precio:</strong><br><strong style="font-size: 0.85rem;">IVA:</strong></div>';
																	            } else if (c === 2) {
																	                col.innerHTML = '<div style="line-height:1.1">Bs. 0<br>Bs. 0</div>';
																	            } else if (c === 3 && (i === 3 || i === 5 || i === 7)) {
																	                // columna 3 en filas 3, 5 y 7: split button (- | +)
																	                const splitWrap = document.createElement('div');
																	                splitWrap.style.cssText = 'display:inline-flex;border:1px solid rgba(0,0,0,0.12);border-radius:4px;overflow:hidden;width:80px;';
																	                // minus button
																	                const minus = document.createElement('button');
																	                minus.type = 'button';
																	                minus.textContent = '-';
																	                minus.setAttribute('aria-label', 'Disminuir');
																	                minus.style.cssText = 'flex:1;height:28px;border:0;background:transparent;cursor:pointer;padding:0;margin:0;display:inline-flex;align-items:center;justify-content:center;font-size:1.2rem;';
																	                // plus button
																	                const plus = document.createElement('button');
																	                plus.type = 'button';
																	                plus.textContent = '+';
																	                plus.setAttribute('aria-label', 'Aumentar');
																	                plus.style.cssText = 'flex:1;height:28px;border:0;background:transparent;cursor:pointer;padding:0;margin:0;display:inline-flex;align-items:center;justify-content:center;border-left:1px solid rgba(0,0,0,0.06);font-size:1.2rem;';
																	                // optional display element between buttons (current value)
																	                const val = document.createElement('span');
																	                val.className = 'split-wrap-value';
																	                val.textContent = '0';
																	                val.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;padding:0 8px;min-width:32px;';
																	                // Asignar un ID único a cada contador para el cálculo total
																	                if (i === 3) val.id = 'counter-ninos';
																	                else if (i === 5) val.id = 'counter-adultos';
																	                else if (i === 7) val.id = 'counter-tercera-edad';

																	                // assemble: [minus][val][plus]
																	                splitWrap.appendChild(minus);
																	                splitWrap.appendChild(val);
																	                splitWrap.appendChild(plus);
																	
																	                const updatePrice = () => {
																	                    const n = parseInt(val.textContent, 10) || 0;
																	                    let precioUnitario;
																	                    if (i === 3) {
																	                        precioUnitario = 70;
																	                    } else if (i === 5) {
																	                        precioUnitario = 100;
																	                    } else { // i === 7
																	                        precioUnitario = 50;
																	                    }
																	                    const precio = n * precioUnitario;
																	                    const iva = n * 16; // IVA se mantiene en 16 por boleto
																	                    const col2 = innerGrid.querySelector('.form4-col:nth-child(2)');
																	                    if (col2) {
																	                        col2.innerHTML = `<div style="line-height:1.1">Bs. ${precio}<br>Bs. ${iva}</div>`;
																	                    }
																	                    updateTotals();
																	                    updateAsientosDisponibles();
																	                };
																	
																	                // prevent clicks from bubbling to parent row
																	                minus.addEventListener('click', function (ev) {
																	                    ev && ev.stopPropagation && ev.stopPropagation();
																	                    ev && ev.preventDefault && ev.preventDefault();
																	                    let n = parseInt(val.textContent,10)||0;
																	                    n = Math.max(0,n-1);
																	                    val.textContent = String(n);
																	                    updatePrice();
																	                });
																	                plus.addEventListener('click', function (ev) {
																	                    ev && ev.stopPropagation && ev.stopPropagation();
																	                    ev && ev.preventDefault && ev.preventDefault();
																	                    let n = parseInt(val.textContent,10)||0;
																	                    n = n+1;
																	                    val.textContent = String(n);
																	                    updatePrice();
																	                });
																	                col.appendChild(splitWrap);
																	            } else {
																	                col.textContent = 'Columna ' + c;
																	            }
																	            innerGrid.appendChild(col);
																	        }
																	        fila.appendChild(innerGrid);
																	    } else if (i === 8) {
																	        // Fila 8: aplicar color #005a96 según solicitud
																	        fila.style.backgroundColor = '#27aae1';
																	        fila.style.color = '#fff';
																	        fila.style.display = 'block';
																	        fila.style.padding = '12px';
																	        fila.style.height = '180px';
																	        fila.style.fontSize = '1rem';
																	        fila.style.boxSizing = 'border-box';
																	        fila.style.borderRadius = '0px 0px 0px 0px';
																	        fila.innerHTML = `
																	            <div style="width: 100%; text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 20px;">INFORMACIÓN</div>
																	            <div style="display: grid; grid-template-columns: 1fr auto; width: 100%;font-size: 16px;">
																	                <span>Cantidad de Boletos:</span><span id="cantidad-boletos" style="text-align: right;">0</span>
																	                <span>Precio de Boleto:</span><span id="precio-boleto" style="text-align: right;">Bs. 0</span>
																	                <div style="grid-column: 1 / -1; height: 10px;"></div>
																	                <span>Subtotal:</span><span id="subtotal" style="text-align: right;">Bs. 0</span>
																	                <span>IVA:</span><span id="iva-total" style="text-align: right;">Bs. 0</span>
																	                <span>A Pagar:</span><span id="a-pagar" style="text-align: right;">Bs. 0</span>
																	                <span>Total:</span><span id="total" style="text-align: right; font-weight: bold;">Bs. 0</span>
																	            </div>
																	        `;
																	    } else {
																	        fila.textContent='Fila '+i;
																	    }
																	    form4Inner.appendChild(fila);
																	}																		form4.appendChild(form4Inner);
																	form4.style.zIndex = 80;
																	form4.style.opacity = 1;
																	// insert into DOM
																	form3.parentNode.insertBefore(form4, form3.nextSibling);
																	// Add a "Continuar" control on the header (right side) while form_4 is active
																	try {
																		const header = document.querySelector('header');
																		if (header) {
																			// create continue button if not already present
																			let contBtn = document.getElementById('continuarBtn');
																			if (!contBtn) {
																				contBtn = document.createElement('button');
																				contBtn.id = 'continuarBtn';
																				contBtn.type = 'button';
																				contBtn.textContent = 'Sig.';
																				// don't set inline layout styles; CSS will position the button absolutely
																				contBtn.setAttribute('aria-hidden', 'false');
																				header.appendChild(contBtn);
																				// make visible and available to AT
																				contBtn.style.display = 'block';
																				try { setHidden(contBtn, false); } catch (e) { /* ignore */ }

																				// click handler: create form_5 and animate it in from the right over form_4
																				contBtn.addEventListener('click', function (ev) {
																					ev && ev.preventDefault && ev.preventDefault();
																					// avoid double-creation
																					if (document.getElementById('form_5')) return;
																					const f5 = document.createElement('div');
																					f5.id = 'form_5'; // Este es el contenedor principal de form_5
																					f5.className = 'clone-detail-panel';
																					f5.style.zIndex = 95; // above form_4 (which is 80)
																					f5.style.opacity = 1;
																					f5.style.width = '100%'; // Asegurar que ocupe el ancho completo
																					f5.style.boxSizing = 'border-box'; // Incluir padding en el ancho
																					f5.style.padding = '0px'; // Incluir padding en el ancho
																					const inner = document.createElement('div');
																					inner.className = 'form5-content';
																					inner.style.cssText = 'width:100%;height:100%;max-width:none;box-sizing:border-box;background:rgba(255,255,255,0.98);padding:0;margin:0;overflow-y: scroll;grid-template-rows:auto 28px auto 28px auto 28px 1fr auto;';
																					
																					// Row 1: 3 columns of information
																					const row1 = document.createElement('div');
																					row1.className = 'form5-row row-1';
																					row1.style.cssText = 'width:100%;height: 80px;padding: 0px 10px 0px 10px;box-sizing:border-box;display:grid;grid-template-columns:repeat(2, 1fr);gap:12px;align-items:center;background:rgba(0,0,0,0.08);border-radius:8px 8px 0 0;font-size:0.85rem;';
																					
																					// Column 1
																					const col1 = document.createElement('div');
																					col1.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
																					col1.innerHTML = '<div><strong>Pelicula:</strong></div><div><strong>Formato:</strong></div><div><strong>Cine:</strong></div>';
																					row1.appendChild(col1);
																					
																					// Column 2
																					const col2 = document.createElement('div');
																					col2.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
																					col2.innerHTML = '<div><strong>Sala:</strong></div><div><strong>Fecha:</strong></div><div><strong>Hora:</strong></div>';
																					row1.appendChild(col2);
																					
																					inner.appendChild(row1);
																					
																					// Row 2: Separator
																					const row2 = document.createElement('div');
																					row2.className = 'form5-row row-2';
																					row2.style.cssText = 'width:100%;display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;';
																					row2.innerHTML = '<strong>Datos de la tarjeta</strong>';
																					inner.appendChild(row2);
																					
																					// Row 3: Credit card info
																					const row3 = document.createElement('div');
																					row3.className = 'form5-row row-3';
																					row3.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items:center;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
																					
																					const cardLabels = ['Numero de Tarjeta:', 'CVV:', 'Vence:'];
																					
																					cardLabels.forEach(text => {
																						const label = document.createElement('strong');
																						label.textContent = text;
																					
																						const input = document.createElement('input');
																						input.type = 'text';
																						if (text === 'CVV:') {
																							input.style.width = '60px';
																						} else if (text === 'Vence:') {
																							input.style.width = '70px';
																						} else {
																							input.style.width = '100%';
																						}
																					
																						row3.appendChild(label);
																						row3.appendChild(input);
																					});
																					
																					inner.appendChild(row3);
																					// Row 4: Separator
																					const row4 = document.createElement('div');
																					row4.className = 'form5-row row-4';
																					row4.style.cssText = 'width:100%;display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;';
																					row4.innerHTML = '<strong>Datos personales</strong>';
																					inner.appendChild(row4);
																					
																					// Row 5: Personal info
																					const row5 = document.createElement('div');
																					row5.className = 'form5-row row-5';
																					row5.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items:center;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
																					
																					const personalLabels = ['Nombre:', 'Cedula:', 'e-mail:', 'tlf:'];
																					
																															personalLabels.forEach(text => {
																																const label = document.createElement('strong');
																																label.textContent = text;
																															
																																const input = document.createElement('input');
																																input.type = 'text';
																					                                            if (text === 'Cedula:') {
																					                                                input.style.width = '80px';
																					                                            } else if (text === 'e-mail:') {
																					                                                input.style.width = '120px';
																					                                            } else if (text === 'tlf:') {
																					                                                input.style.width = '100px';
																					                                            } else {
																																    input.style.width = '160px';
																					                                            }
																															
																																row5.appendChild(label);
																																row5.appendChild(input);
																															});																						inner.appendChild(row5);
																					
																															// Row 6: Separator
																															const row6 = document.createElement('div');
																															row6.className = 'form5-row row-6';
																															row6.style.cssText = 'width:100%;display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;';
																					                                        row6.innerHTML = '<strong>Terminos y condiciones</strong>';
																															inner.appendChild(row6);
																															
																															// Row 7: Flexible area with terms and conditions
																					                                        const row7 = document.createElement('div');
																					                                        row7.className = 'form5-row row-7';
																					                                        row7.style.cssText = 'width:100%;padding:12px;box-sizing:border-box;overflow:auto;background:rgba(0,0,0,0.08);border-radius:0 0 8px 8px;';
																					
																					                                        const termsContainer = document.createElement('div');
																					                                        termsContainer.style.height = '150px';
																					                                        termsContainer.style.display = 'flex';
																					                                        termsContainer.style.flexDirection = 'column';
																					
																					                                        const termsText = document.createElement('div');
																					                                        termsText.style.flex = '1';
																					                                        termsText.style.overflowY = 'auto';
																					                                        termsText.style.border = '1px solid #ccc';
																					                                        termsText.style.padding = '8px';
																					                                        termsText.style.backgroundColor = '#fff';
																					                                        termsText.innerHTML = `
																					                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
																					                                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
																					                                            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
																					                                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
																					                                        `;
																					
																					                                        const buttonContainer = document.createElement('div');
																					                                        buttonContainer.style.textAlign = 'center';
																					                                        buttonContainer.style.paddingTop = '12px';
																					
																					                                        const acceptButton = document.createElement('button');
																					                                        acceptButton.textContent = 'Aceptar';
																					                                        acceptButton.disabled = true;
																					
																					                                        buttonContainer.appendChild(acceptButton);
																					                                        termsContainer.appendChild(termsText);
																					                                        termsContainer.appendChild(buttonContainer);
																					                                        row7.appendChild(termsContainer);
																					
																					                                        termsText.addEventListener('scroll', () => {
																					                                            if (termsText.scrollTop + termsText.clientHeight >= termsText.scrollHeight - 5) { // A small tolerance
																					                                                acceptButton.disabled = false;
																					                                            } else {
																					                                                acceptButton.disabled = true;
																					                                            }
																					                                        });

																					                                        // Mover la lógica del botón 'Continuar' al botón 'Aceptar'
																					                                        acceptButton.addEventListener('click', function(e) {
																					                                            e.preventDefault();
																					                                            // La función que abre form_6 ahora es llamada desde aquí.
																					                                            // Esta función está definida más abajo, dentro del event listener del botón 'continuarBtn' original.
																					                                            // Para mantener la modularidad, la invoco directamente.
																					                                            const f5ContBtn = document.getElementById('form5-contBtn');
																					                                            if (f5ContBtn) f5ContBtn.click();
																					                                        });

																					
																					                                        inner.appendChild(row7);																						// hide header buttons from form_4 while f5 is open
																					try {
																						const hdrBack = document.getElementById('backBtn');
																						const hdrCont = document.getElementById('continuarBtn');
																						if (hdrBack) {
																							hdrBack._prevDisplay = hdrBack.style.display;
																							hdrBack.style.display = 'none';
																							try { setHidden(hdrBack, true); } catch (e) {}
																						}
																						if (hdrCont) {
																							hdrCont._prevDisplay = hdrCont.style.display;
																							hdrCont.style.display = 'none';
																							try { setHidden(hdrCont, true); } catch (e) {}
																						}
																					} catch (e) { /* ignore */ }

																					// create header buttons for form_5 (Atras left, Continuar right)
																					const headerEl = document.querySelector('header');
																					let form5BackHdr = headerEl && document.getElementById('form5-backBtn');
																					if (!form5BackHdr && headerEl) {
																						form5BackHdr = document.createElement('button');
																						form5BackHdr.id = 'form5-backBtn';
																						form5BackHdr.type = 'button';
																						form5BackHdr.textContent = 'Atras';
																						headerEl.appendChild(form5BackHdr);
																						form5BackHdr.style.display = 'block';
																						try { setHidden(form5BackHdr, false); } catch (e) {}
																					}
																					let form5ContHdr = headerEl && document.getElementById('form5-contBtn');
																					if (!form5ContHdr && headerEl) {
																						form5ContHdr = document.createElement('button');
																						form5ContHdr.id = 'form5-contBtn';
																						form5ContHdr.type = 'button';
																						form5ContHdr.textContent = 'Continuar';
																						headerEl.appendChild(form5ContHdr);
																						form5ContHdr.style.display = 'block';
																						try { setHidden(form5ContHdr, false); } catch (e) {}
																					}
																					// Ocultar el botón Continuar del header para form_5
																					if (form5ContHdr) form5ContHdr.style.display = 'none';

																					f5.appendChild(inner);
																					// insert after form4 so it overlays
																					form4.parentNode.insertBefore(f5, form4.nextSibling);
																					// force reflow then animate in using the same .in handling used for form_4
																					void f5.offsetWidth;
																					f5.classList.add('in');

																					// focus management: give focus to the form_5 header back button
																					try { const bf = document.getElementById('form5-backBtn'); if (bf && typeof bf.focus === 'function') bf.focus(); } catch (e) {}

																					// wire the independent buttons inside form_5
																					try {
																						// header-placed buttons for form_5
																						const f5BackBtn = document.getElementById('form5-backBtn');
																						const f5ContBtn = document.getElementById('form5-contBtn');
																						function closeForm5() {
																							if (!f5) return;
																							f5.classList.remove('in');
																							setTimeout(() => { try { f5.parentNode && f5.parentNode.removeChild(f5); } catch (e) {} }, 320);
																							// restore header buttons for form_4
																							try {
																								const hdrBack = document.getElementById('backBtn');
																								const hdrCont = document.getElementById('continuarBtn');
																								if (hdrBack) {
																									hdrBack.style.display = hdrBack._prevDisplay || 'block';
																									try { setHidden(hdrBack, false); } catch (e) {}
																								}
																								if (hdrCont) {
																									hdrCont.style.display = hdrCont._prevDisplay || 'block';
																									try { setHidden(hdrCont, false); } catch (e) {}
																								}
																								// remove form_5 header buttons if present
																								try {
																									const f5b = document.getElementById('form5-backBtn');
																									if (f5b && f5b.parentNode) f5b.parentNode.removeChild(f5b);
																									const f5c = document.getElementById('form5-contBtn');
																									if (f5c && f5c.parentNode) f5c.parentNode.removeChild(f5c);
																								} catch (e) { /* ignore */ }
																							} catch (e) { /* ignore */ }

																							// Restore header to 'Boletos' for form_4
																							try {
																								const headerH1 = document.querySelector('header h1');
																								if (headerH1) {
																									const strong = headerH1.querySelector('strong');
																									if (strong) strong.textContent = 'Boletos'; else headerH1.textContent = 'Boletos';
																								}
																							} catch (e) { /* ignore */ }
																						}
																						if (f5BackBtn) {
																							f5BackBtn.addEventListener('click', function (e) {
																								e && e.preventDefault && e.preventDefault();
																								closeForm5();
																							});
																						}
																						if (f5ContBtn) {
																							// La lógica para abrir form_6 se mantiene aquí, pero será invocada por el botón 'Aceptar'
																							const openForm6 = function (e) {
																								e && e.preventDefault && e.preventDefault();
																								// Open form_6 as an independent panel that slides in from the right
																								if (document.getElementById('form_6')) return;
																								// ... (toda la lógica de creación de form_6)
																							};

																							// Esta es la función que será llamada por el botón Aceptar.
																							// Se mantiene la lógica original de creación de form_6.
																							// El botón f5ContBtn ya no es visible, pero su listener se usa programáticamente.
																							if (!f5ContBtn._bound) {
																								f5ContBtn.addEventListener('click', openForm6);
																								f5ContBtn._bound = true;
																							f5ContBtn.addEventListener('click', function (e) {
																								e && e.preventDefault && e.preventDefault();
																								// Open form_6 as an independent panel that slides in from the right
																								if (document.getElementById('form_6')) return;
																								const form6 = document.createElement('div');
																								form6.id = 'form_6';
																								form6.className = 'clone-detail-panel';
																								form6.style.zIndex = 110;
																								form6.style.width = '100%'; // above form_5

																								// Create a temporary loading overlay
																								const loadingOverlay = document.createElement('div');
																								loadingOverlay.style.cssText = `
																									position: fixed; top: 0; left: 0; width: 100%; height: 100%;
																									background-color: rgba(0, 0, 0, 0.8);
																									z-index: 199; display: flex; justify-content: center; align-items: center;
																								`;
																								const spinner = document.createElement('i');
																								spinner.className = 'fa fa-spinner fa-spin';
																								spinner.style.color = 'white';
																								spinner.style.fontSize = '4rem';
																								spinner.setAttribute('aria-hidden', 'true');
																								loadingOverlay.appendChild(spinner);
																								document.body.appendChild(loadingOverlay);

																								// After 2 seconds, remove loading and show success message
																								setTimeout(() => {
																									if (loadingOverlay.parentNode) {
																										loadingOverlay.parentNode.removeChild(loadingOverlay);
																									}
																									// Now show the success overlay
																									const successOverlay = document.getElementById('success-overlay');
																									if (successOverlay) {
																										successOverlay.style.display = 'flex';
																									}
																								}, 2000);
																								// create content container for form_6 (simple placeholder grid)
																								const f6inner = document.createElement('div');
																								f6inner.className = 'form6-content';

																								// Crear el overlay de éxito de la transacción
																								const successOverlay = document.createElement('div');
																								successOverlay.id = 'success-overlay';
																								successOverlay.style.cssText = `
																									position: fixed;
																									top: 0;
																									left: 0;
																									width: 100%;
																									height: 100%;
																									background-color: rgba(0, 0, 0, 0.8);
																									z-index: 200;
																									display: none; /* Initially hidden */
																									justify-content: center;
																									align-items: center;
																									cursor: pointer;
																								`;

																								const successBox = document.createElement('div');
																								successBox.style.cssText = `
																									background-color: black;
																									width: 220px;
																									color: white;
																									padding: 20px 40px;
																									border-radius: 8px;
																									font-size: 1.5rem;
																									text-align: center;
																								`;
																								successBox.innerHTML = '<strong>¡Transacción Exitosa!</strong>';

																								successOverlay.appendChild(successBox);

																								successOverlay.addEventListener('click', () => {
																									if (successOverlay.parentNode) {
																										successOverlay.parentNode.removeChild(successOverlay);
																									}
																								});

																								// 7 rows: 1=60px, 2=28px (separator style), 3=60px, 4=28px, 5=flex, 6=28px, 7=flex (duplicate of row5)
																								// ensure border-radius matches form_5
																								f6inner.style.cssText = 'width:100%;height:100%;box-sizing:border-box;background:rgba(255,255,255,0.98);padding:0;margin:0;display:grid;grid-template-rows:28px 80px 28px 95px 28px 1fr;border-radius:0px 0px 0 0;';
																								const f6r1 = document.createElement('div'); f6r1.innerHTML = '<strong>Datos de la compra</strong>'; f6r1.style.cssText='display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;justify-content:flex-start;';
																								const f6r2 = document.createElement('div');
																								f6r2.style.cssText = 'padding:12px;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;background:rgba(0,0,0,0.08);font-size:0.85rem;';
																								const col1_r2_clone = document.createElement('div');
																								col1_r2_clone.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
																								col1_r2_clone.innerHTML = '<div><strong>Pelicula:</strong></div><div><strong>Formato:</strong></div><div><strong>Cine:</strong></div>';
																								f6r2.appendChild(col1_r2_clone);
																								const col2_r2_clone = document.createElement('div');
																								col2_r2_clone.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
																								col2_r2_clone.innerHTML = '<div><strong>Sala:</strong></div><div><strong>Fecha:</strong></div><div><strong>Hora:</strong></div>';
																								f6r2.appendChild(col2_r2_clone);
																								const f6r3 = document.createElement('div');
																								f6r3.innerHTML = '<strong>Datos de la tarjeta</strong>';
																								f6r3.style.cssText = 'display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;justify-content:flex-start;';
																								const f6r4 = document.createElement('div');
																								f6r4.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items:center;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
																								['Numero de Tarjeta:', 'CVV:', 'Vence:'].forEach(text => {
																									const label = document.createElement('strong');
																									label.textContent = text;
																									const input = document.createElement('input');
																									input.type = 'text';
																									input.disabled = true; // Deshabilitar el input
																									if (text === 'CVV:') input.style.width = '60px';
																									else if (text === 'Vence:') input.style.width = '70px';
																									else input.style.width = '100%';
																									f6r4.appendChild(label);
																									f6r4.appendChild(input);
																								});
																								const f6r5 = document.createElement('div');
																								f6r5.innerHTML = '<strong>Datos personales</strong>';
																								f6r5.style.cssText = 'display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:#27aae1;color:#fff;height:28px;justify-content:flex-start;';
																								const f6r6 = document.createElement('div');
																								f6r6.style.cssText = 'width:100%;box-sizing:border-box;display:grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-content:start;background:rgba(0,0,0,0.08);padding:12px;font-size: 14px;';
																								['Nombre:', 'Cedula:', 'e-mail:', 'tlf.:'].forEach(text => {
																									const label = document.createElement('strong');
																									label.textContent = text;
																									const input = document.createElement('input');
																									input.type = 'text';
																									input.disabled = true; // Deshabilitar el input
																									if (text === 'Cedula:') input.style.width = '80px';
																									else if (text === 'e-mail:') input.style.width = '120px';
																									else if (text === 'tlf.:') input.style.width = '100px';
																									else input.style.width = '100%';
																									f6r6.appendChild(label);
																									f6r6.appendChild(input);
																								});
																								f6inner.appendChild(f6r1); f6inner.appendChild(f6r2); f6inner.appendChild(f6r3); f6inner.appendChild(f6r4); f6inner.appendChild(f6r5); f6inner.appendChild(f6r6);
																								form6.appendChild(f6inner);
																								// insert after form5 so it overlays
																								f5.parentNode.insertBefore(form6, f5.nextSibling);

																								// Añadir el overlay al body para que cubra toda la pantalla
																								document.body.appendChild(successOverlay);

																								// hide form5 header buttons while form6 is active
																								try {
																									const f5b = document.getElementById('form5-backBtn');
																									const f5c = document.getElementById('form5-contBtn');
																									if (f5b) { f5b._prevDisplay = f5b.style.display; f5b.style.display='none'; try{ setHidden(f5b,true);}catch(e){} }
																									if (f5c) { f5c._prevDisplay = f5c.style.display; f5c.style.display='none'; try{ setHidden(f5c,true);}catch(e){} }
																								} catch(e){}
																								// create header buttons for form_6
																								const headerEl = document.querySelector('header');
																								let f6cont = headerEl && document.getElementById('form6-contBtn');
																								if (!f6cont && headerEl) { f6cont = document.createElement('button'); f6cont.id='form6-contBtn'; f6cont.type='button'; f6cont.textContent='Listo'; headerEl.appendChild(f6cont); f6cont.style.display='block'; try{ setHidden(f6cont,false);}catch(e){} }
																								// animate in
																								void form6.offsetWidth; form6.classList.add('in');
																								try { updateHeaderTitle(); } catch (e) { /* ignore */ }
																								// focus
																								try { if (f6cont && typeof f6cont.focus==='function') f6cont.focus(); } catch(e){}
																								// wire f6 handlers via centralized helper
																								try { ensureForm6Handlers(); } catch (e) {}
																							});
																						}
																						}
																					} catch (e) { /* ignore wiring errors */ }

																					// provide a way to close form_5 with Escape or a click on the header back button if desired
																					f5.addEventListener('keydown', function (e) {
																						if (e.key === 'Escape') {
																							f5.classList.remove('in');
																							setTimeout(() => { try { f5.parentNode && f5.parentNode.removeChild(f5); } catch (e) {} }, 300);
																						}
																					});

																					// Cambiar el título del header a "Pago"
																					try {
																						const headerH1 = document.querySelector('header h1');
																						if (headerH1) {
																							const strong = headerH1.querySelector('strong');
																							if (strong) strong.textContent = 'Pago'; else headerH1.textContent = 'Pago';
																						}
																					} catch (e) { /* ignore */ }

																					// Animar la entrada de form_5
																					f5.classList.add('in');

																				});
																			}
																		}
																	} catch (e) { /* ignore header continue button errors */ }
																	// set header to 'Boletos' when form_4 appears
																	try {
																		const headerH1 = document.querySelector('header h1');
																		if (headerH1) {
																			const strong = headerH1.querySelector('strong');
																			if (strong) strong.textContent = 'Boletos'; else headerH1.textContent = 'Boletos';
																		}
																	} catch (e) { /* ignore */ }
																	setTimeout(() => { form4.classList.add('in'); }, 20);
																	// Keep form3 visible underneath form4 but make it inert
																	// so it doesn't accept pointer events or focus. This
																	// prevents form_2 from flashing when form4 animates out.
																	try {
																		// Keep form3 visible but not interactive
																		setHidden(form3, true); 
																		form3.style.pointerEvents = 'none';
																	} catch (e) { /* ignore */ }
									
																	// Use the page header's back button (id=backBtn) as the 'Atras' control for form_4.
																	try {
																		const originalBack = document.getElementById('backBtn');
																		if (originalBack) {
																			// save previous state to restore later
																			originalBack._savedDisplay = originalBack.style.display;
																			originalBack._savedText = originalBack.textContent;
									
																			// Temporarily remove the form_3 back handler
																			if (originalBack._form3Click) {
																				originalBack.removeEventListener('click', originalBack._form3Click);
																			}
									
																			// create a temporary handler to close form_4
																			originalBack._form4Click = function (ev) {
																				if (ev && ev.preventDefault) ev.preventDefault();
																				if (ev && ev.stopPropagation) ev.stopPropagation();
									
																				// animate out form4 then restore form3 and header
																				form4.classList.remove('in');
																				setTimeout(() => {
																					try {
																						if (form3) {
																							setHidden(form3, false);
																							form3.style.pointerEvents = '';
																						}
																						// restore header to the detail (Pelicula)
																						const headerH1 = document.querySelector('header h1');
																						if (headerH1) {
																							const strong = headerH1.querySelector('strong');
																							if (strong) strong.textContent = 'Pelicula'; else headerH1.textContent = 'Pelicula';
																						}
																					} catch (err) { /* ignore visual restore errors */ }
									
																					// remove form4 from DOM now that its animation finished
																					if (form4.parentNode) form4.parentNode.removeChild(form4);
									
																					// also remove the 'Continuar' button and any form_5 overlay if present
																					try {
																						const cont = document.getElementById('continuarBtn');
																						if (cont && cont.parentNode) cont.parentNode.removeChild(cont);
																						['form_5', 'form_6'].forEach(id => {
																							const f = document.getElementById(id);
																							if (f && f.parentNode) f.parentNode.removeChild(f);
																						});
																						['form5-backBtn', 'form5-contBtn', 'form6-backBtn', 'form6-contBtn'].forEach(id => {
																							const b = document.getElementById(id);
																							if (b && b.parentNode) b.parentNode.removeChild(b);
																						});
																					} catch (e) { /* ignore */ }
									
																					// restore original back button behavior and text
																					originalBack.removeEventListener('click', originalBack._form4Click);
																					if (originalBack._form3Click) {
																						originalBack.addEventListener('click', originalBack._form3Click);
																					}
																					originalBack.textContent = 'Atras';
																					originalBack.style.display = 'block';
																				}, 350);
																			};
																			// attach temporary handler and show the button in header on the left
																			originalBack.addEventListener('click', originalBack._form4Click);
																			originalBack.style.display = 'block';
																			setHidden(originalBack, false);
																			originalBack.textContent = 'Atras';
																		}
																	} catch (e) { /* ignore header/back button errors */ }
																}
															} catch (err) { /* ignore */ }
														}, 1000); // 1 segundo
													} catch (err) { /* ignore */ }
												}, 1000);
											} catch (err) { /* ignore */ }
										}
										function clearPress() {
											if (pressTimer) {
												clearTimeout(pressTimer);
												pressTimer = null;
											}
										}

										// mouse events
										btnRef.addEventListener('mousedown', startPress);
										btnRef.addEventListener('mouseup', function (e) {
											clearPress();
										});
										btnRef.addEventListener('mouseleave', function () {
											clearPress();
										});
										// touch events
										btnRef.addEventListener('touchstart', startPress, { passive: true });
										btnRef.addEventListener('touchend', function () { clearPress(); });
										btnRef.addEventListener('touchcancel', function () { clearPress(); });
										// cancel on contextmenu as well
										btnRef.addEventListener('contextmenu', function () { clearPress(); });

										// when click handler cancels processing (click while processing), ensure locks are removed
										const origClick = btnRef.onclick;
										// we can't reliably read onclick; instead, also wrap MutationObserver or rely on existing click handler code
										// handled in click handler above where clicking during processing removed the processing class - ensure lock removed there
										btnRef.addEventListener('click', function () {
											if (!btnRef.classList.contains('processing')) return;
											// it was processing and click handler will revert to purchased - remove processing lock
											removeProcessingLock();
										});
									})(btn);
									rowDiv.appendChild(btn);
								}
								leftBtnGrid.appendChild(rowDiv);
							}
							leftCell.appendChild(leftBtnGrid);
							// No adjacent static text: button labels must be provided from HTML via `data-btns` or `.btn-source`.
							// We intentionally do not append any "Left N" text or editable caption here.

							// RIGHT column cell (image on top, editable caption below)
							const rightCell = document.createElement('div');
							rightCell.className = 'cdb-grid-cell cdb-grid-right';

							const imgDiv = document.createElement('div');
							imgDiv.className = 'cdb-grid-img';
							// assign randomly one of the two format images and set matching caption
							try {
								const formats = [
									{ src: 'images/3d.jpg', label: 'Formato 3D' },
									{ src: 'images/4dx.jpg', label: 'Formato 4DX' }
								];
								const pick = formats[Math.floor(Math.random() * formats.length)];
								// put an <img> inside the img container so layout/duplication keeps working
								imgDiv.innerHTML = `<img src="${pick.src}" alt="${pick.label}" style="width:100%;height:auto;object-fit:cover;">`;
								// store the chosen format on the element for possible later reuse
								imgDiv.dataset.format = pick.label;
							} catch (e) {
								// fallback to placeholder SVG if anything goes wrong
								imgDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="#f3f3f3"/><g fill="#ddd"><circle cx="20" cy="20" r="8"/></g></svg>';
							}

							const caption = document.createElement('div');
							caption.className = 'cdb-grid-caption';
							caption.setAttribute('contenteditable', 'true');
							caption.setAttribute('aria-label', 'Right column caption ' + (rowIndex + 1));
							// prefer label from cellLabels[6..11] but if not present set caption according to chosen format
							try {
								const captionLabelIndex = 6 + rowIndex;
								const fromHtml = (cellLabels && cellLabels[captionLabelIndex]) ? cellLabels[captionLabelIndex] : null;
								if (fromHtml) {
									caption.textContent = fromHtml;
								} else {
									// if we set a dataset.format on imgDiv, prefer that; otherwise use a random pick again
									const chosen = imgDiv.dataset && imgDiv.dataset.format ? imgDiv.dataset.format : (Math.random() < 0.5 ? 'Formato 3D' : 'Formato 4DX');
									caption.textContent = chosen;
								}
							} catch (e) {
								caption.textContent = 'Formato 3D';
							}

							rightCell.appendChild(imgDiv);
							rightCell.appendChild(caption);

							grid.appendChild(leftCell); // This will be the first cell in the implicit row
							grid.appendChild(rightCell);
							// after each content row except the last, insert a full-width separator element
							if (rowIndex < numRowsToCreate - 1) {
								// replace thin separator with a full-width separator row that matches the top row
								const sep = document.createElement('div');
								sep.className = 'cdb-grid-sep';
								sep.style.gridColumn = '1 / -1';
								sep.style.backgroundColor = '#005a96';
								sep.style.color = '#fff';
								sep.style.display = 'flex';
								sep.style.alignItems = 'center';
								sep.style.justifyContent = 'flex-start';
								sep.style.padding = '0 12px';
								sep.style.height = '28px';
								const sepStrong = document.createElement('strong');
								sepStrong.textContent = selectedLocations[rowIndex + 1] || 'Cine'; // Use next location name
								sep.appendChild(sepStrong);
								grid.appendChild(sep);
							}
						}
						row2.appendChild(grid);

						bottom.appendChild(row1);

						// Update the top row text with the first selected location
						try {
							const topRowStrong = grid.querySelector('.cdb-grid-toprow strong');
							if (topRowStrong) {
								topRowStrong.textContent = selectedLocations[0] || 'Cine';
							}
						} catch(e) { /* ignore */ }
						bottom.appendChild(row2);

						// insert the rows container into the detail panel
						detail.appendChild(bottom);

							// insert detail after the clone in DOM (so it's on top)
							// place it as a sibling so it overlays without moving the original scroll container
							clone.parentNode && clone.parentNode.insertBefore(detail, clone.nextSibling);

							// When form_3 (detail) appears, update the header to show the movie title
							try {
								const headerH1 = document.querySelector('header h1');
								if (headerH1) {
									const strong = headerH1.querySelector('strong');
									if (strong) strong.textContent = 'Pelicula'; else headerH1.textContent = 'Pelicula';
								}
							} catch (e) { /* ignore header update errors */ }

							// Hide the original back button while form_3 is visible (it should only appear on form_2)
							try {
								const originalBack = document.getElementById('backBtn');
								if (originalBack) {
									// hide visually and from AT
									originalBack.style.display = 'none';
									setHidden(originalBack, true);
								}
							} catch (err) { /* ignore */ }

							// force reflow then animate detail in
							void detail.offsetWidth;
							detail.classList.add('in');

							// Use the page header's back button (id=backBtn) as the 'Atras' control for form_3.
							try {
								const headerBackBtn = document.getElementById('backBtn');
								if (headerBackBtn) {
									// Save previous state to restore later
									headerBackBtn._savedDisplay_f3 = headerBackBtn.style.display;
									headerBackBtn._savedText_f3 = headerBackBtn.textContent;
									// Remove the global back handler while form_3 is active
									try { headerBackBtn.removeEventListener('click', handleBackAction); } catch (e) {}
									
									// Create a temporary handler to close form_3
									const removeDetail = (e) => {
										if (e) {
											e.preventDefault();
											e.stopPropagation();
										}
										detail.classList.remove('in');
										setTimeout(() => {
											try { detail.parentNode && detail.parentNode.removeChild(detail); } catch (e) {}
											const form2 = document.getElementById('form_2');
											if(form2) setHidden(form2, false);
											// Restore header to the summary view (Cartelera)
											try {
												const headerH1 = document.querySelector('header h1');
												if (headerH1) {
													const strong = headerH1.querySelector('strong');
													if (strong) strong.textContent = 'Cartelera'; else headerH1.textContent = 'Cartelera';
												}
											} catch (e) { /* ignore */ }

											// Restore original back button behavior and text
											headerBackBtn.removeEventListener('click', removeDetail);
											headerBackBtn.addEventListener('click', handleBackAction);
											headerBackBtn.style.display = 'none';
										}, 340);
									};
									headerBackBtn._form3Click = removeDetail; // Save the handler
									headerBackBtn.addEventListener('click', removeDetail);
									headerBackBtn.style.display = 'block';
									setHidden(headerBackBtn, false);
									headerBackBtn.textContent = 'Atras';
										}
							} catch (e) {
								console.error("Error setting up form_3 back button:", e);
							}

							// perform the original click action after creating the panel
							if (forId) {
								const target = document.getElementById(forId);
								if (target && typeof target.click === 'function') {
									target.click();
								} else {
									lbl.click();
								}
							} else {
								lbl.click();
							}
						} finally {
							// cleanup small delay after original action
							setTimeout(() => {
								clone.classList.remove('clone-rows-hidden');
								clone._animatingCloneRows = false;
							}, 20);
						}
					};

					// start the detail panel a bit earlier so it overlaps the clone-row slide
					// smaller buffer than the full clone-row animation to make form_3 appear sooner
					setTimeout(doAfterAnimation, 220);
				});

				// Make existing clone-row elements show pointer and be keyboard navigable
				Array.from(clone.querySelectorAll('.clone-row')).forEach(r => {
					r.style.cursor = 'pointer';
					if (!r.hasAttribute('tabindex')) r.setAttribute('tabindex', '0');
					r.setAttribute('role', 'button');
				});

				// Keyboard support for clone-row: Enter/Space triggers the associated label
				clone.addEventListener('keydown', function (ev) {
					const row = ev.target.closest && ev.target.closest('.clone-row');
					if (!row) return;
					if (ev.key === 'Enter' || ev.key === ' ') {
						ev.preventDefault();
						const lbl = row.closest('label');
						if (lbl) lbl.click();
					}
				});
			} catch (setupErr) {
				console.debug('[clone customization] failed to setup clickable .clone-row', setupErr);
			}
			// Remove any back button that may have been cloned inside the cloned form
			const clonedBackButtons = clone.querySelectorAll('[id^="backBtn"]');
			clonedBackButtons.forEach(b => {
				try { b.parentNode && b.parentNode.removeChild(b); } catch (e) {}
			});
			// Ensure the original singleton back button is marked and enabled
			const originalBack = document.getElementById('backBtn');
			if (originalBack) {
				originalBack.dataset.role = 'back';
				setHidden(originalBack, false);
				originalBack.style.display = 'none';
				originalBack.disabled = false;
				// ensure handler attached (idempotent)
				try {
					originalBack.removeEventListener('click', handleBackAction);
					originalBack.addEventListener('click', handleBackAction);
					console.debug('[readyBtn] ensured original backBtn has handler and is enabled');
				} catch (err) { console.debug('[readyBtn] error attaching handler to original backBtn', err); }
			}
			// move focus out of the original form if focus is inside it, to avoid aria-hidden on focused
			moveFocusIfInside(originalForm, 'backBtn');
			setHidden(originalForm, true);
			originalForm.style.display = 'none';
		}

		// Collapse and clear the original form as before
		document.querySelectorAll('.type-panel.open').forEach(p => p.classList.remove('open'));
		document.querySelectorAll('.city-labels label.expanded').forEach(l => l.classList.remove('expanded'));
		radios.forEach(r => r.checked = false);
		document.querySelectorAll('.type-panel .row.checked').forEach(r => {
			r.classList.remove('checked');
			r.setAttribute('aria-checked', 'false');
		});
		if (originalForm) {
			// ensure no focused element remains inside panels to be removed
			moveFocusIfInside(originalForm, 'backBtn');
			originalForm.querySelectorAll('.type-panel').forEach(p => p.parentNode && p.parentNode.removeChild(p));
		}
		const labelsEl = document.querySelector('.city-labels');
		if (labelsEl) {
			labelsEl.style.animation = 'none';
			void labelsEl.offsetWidth;
			setTimeout(() => { labelsEl.style.animation = ''; }, 20);
		}
		updateReadyButton();
		const back = document.getElementById('backBtn');
		if (back) {
			// move focus away from readyBtn before hiding it
			moveFocusIfInside(document.getElementById('readyBtn'), 'backBtn');
			readyBtn.style.display = 'none';
			setHidden(readyBtn, true);
			// ensure back is un-hidden (remove inert) and visible
			setHidden(back, false);
			back.style.display = 'none';
		}

		// Update header text to indicate summary view (Cartelera) but preserve inner <strong>
		try {
			const headerH1 = document.querySelector('header h1');
			if (headerH1) {
				const strong = headerH1.querySelector('strong');
				if (strong) strong.textContent = 'Cartelera';
				else headerH1.textContent = 'Cartelera';
			}
		} catch (err) { /* ignore */ }
	});
}

// Atras button restores panels and swaps buttons back - robust handler
const backBtn = document.getElementById('backBtn');

function handleBackAction(e) {
	if (e && e.preventDefault) e.preventDefault();
		hideCinesView();
	console.debug('[handleBackAction] invoked');
	const labelsEl = document.querySelector('.city-labels');
	if (!labelsEl) {
		console.debug('[handleBackAction] no .city-labels found, aborting');
		return;
	}

	// If an independent summary form was created, remove it first
	if (savedSummaryForm) {
		console.debug('[handleBackAction] found savedSummaryForm, removing clone');
		const originalForm = document.querySelector('form');
		// move focus out of the cloned form before removing
		moveFocusIfInside(savedSummaryForm, 'readyBtn');
		savedSummaryForm.parentNode && savedSummaryForm.parentNode.removeChild(savedSummaryForm);
			savedSummaryForm = null;

			// hide footer icons when the cloned summary form is removed
			try {
				const deviceEl = document.querySelector('.device');
				if (deviceEl) deviceEl.classList.remove('show-footer-icons');
			} catch (err) { /* ignore */ }
		if (originalForm) {
			// move focus into original form's header/button area
			moveFocusIfInside(originalForm, 'readyBtn');
			// ensure original form is un-hidden/inert removed so interactions work
			setHidden(originalForm, false);
			originalForm.style.display = '';
		}
	} else {
		console.debug('[handleBackAction] no savedSummaryForm present');
	}

	// Restore panels if missing
	const anyPanelAfterRemoval = !!document.querySelector('.type-panel');
	console.debug('[handleBackAction] anyPanelAfterRemoval =', anyPanelAfterRemoval);
	if (!anyPanelAfterRemoval && savedPanelTemplate) {
		console.debug('[handleBackAction] restoring panels from savedPanelTemplate');
		const labelsNow = Array.from(document.querySelectorAll('.city-labels label'));
		labelsNow.forEach(l => {
			const panelClone = savedPanelTemplate.cloneNode(true);
			panelClone.classList.remove('doppio-panel');
			panelClone.classList.add('type-panel');
			// make restored panels available (not hidden) so labels can open them
			setHidden(panelClone, false);
					l.parentNode.insertBefore(panelClone, l.nextSibling);

			// If previously expanded for this label, make it open
			if (window._savedExpandedFor && window._savedExpandedFor === l.getAttribute('for')) {
				l.classList.add('expanded');
				panelClone.classList.add('open');
				// ensure the corresponding radio is checked
				const rid = document.getElementById(l.getAttribute('for'));
				if (rid) rid.checked = true;
			}
					console.debug('[restored panel] for=', l.getAttribute('for'), 'class=', panelClone.className, 'aria-hidden=', panelClone.getAttribute('aria-hidden'), 'inert=', panelClone.inert);

			const forKey = l.getAttribute('for');
			const savedRows = window._savedRowSelections && window._savedRowSelections[forKey];
			if (savedRows) {
				const rows = Array.from(panelClone.querySelectorAll('.row'));
				rows.forEach((row, idx) => {
					if (savedRows[idx]) {
						row.classList.add('checked');
						row.setAttribute('aria-checked', 'true');
					} else {
						row.classList.remove('checked');
						row.setAttribute('aria-checked', 'false');
					}
				});
			}
		});

		// initialize rows for accessibility
		const newRows = Array.from(document.querySelectorAll('.type-panel .row'));
		newRows.forEach(r => {
			if (!r.hasAttribute('tabindex')) r.setAttribute('tabindex', '0');
			r.setAttribute('aria-checked', r.classList.contains('checked') ? 'true' : 'false');
			r.setAttribute('role', 'checkbox');
		});

		// re-bind labels
		const labelsCurrent = Array.from(document.querySelectorAll('.city-labels label'));
		labelsCurrent.forEach(label => {
			if (label._cityClickHandler) label.removeEventListener('click', label._cityClickHandler);
			const handler = function (ev) {
				ev.preventDefault();
				const forId = label.getAttribute('for');
				const radio = document.getElementById(forId);
				const panel = label.nextElementSibling && label.nextElementSibling.classList.contains('type-panel') ? label.nextElementSibling : null;
				if (!radio) return;
				const wasChecked = radio.checked;
				const formEl = label.closest('form');
				if (wasChecked) {
					radio.checked = false;
					label.classList.remove('expanded');
					if (panel) panel.classList.remove('open');
				} else {
					radios.forEach(r => r.checked = false);
					document.querySelectorAll('.city-labels label.expanded').forEach(l => l.classList.remove('expanded'));
					document.querySelectorAll('.type-panel.open').forEach(p => p.classList.remove('open'));
					radio.checked = true;
					label.classList.add('expanded');
					if (panel) {
						// make panel available to AT and allow focus inside
						setHidden(panel, false);
						panel.classList.add('open');
					}
					if (panel && formEl) setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
				}
				radio.dispatchEvent(new Event('change', { bubbles: true }));
			};
			label.addEventListener('click', handler);
			label._cityClickHandler = handler;
			label.setAttribute('tabindex', '0');
			label.setAttribute('role', 'button');
		});
	} else {
		console.debug('[handleBackAction] panels already present or no template available');
	}

	// swap buttons back
	const ready = document.getElementById('readyBtn');
	if (ready) {
		ready.style.display = 'inline-block';
		setHidden(ready, false);
		updateReadyButton();
	}
	// hide all back buttons (original + clones) to ensure none remain interactive
	const allBackButtons = Array.from(document.querySelectorAll('button[data-role="back"]'));
	allBackButtons.forEach(b => {
		moveFocusIfInside(b, 'readyBtn');
		b.style.display = 'none';
		setHidden(b, true);
	});

	// Restore header text back to initial state (Ciudad) but preserve inner <strong>
	try {
		const headerH1 = document.querySelector('header h1');
		if (headerH1) {
			const strong = headerH1.querySelector('strong');
			if (strong) strong.textContent = 'Ciudad';
			else headerH1.textContent = 'Ciudad';
		}
	} catch (err) { /* ignore */ }
}

if (backBtn) {
	backBtn.addEventListener('click', handleBackAction);
	console.debug('[init] backBtn listener attached, id=', backBtn.id);
}

// Delegated listener: handle clicks on cloned back button (e.g., 'backBtn-clone')
// Delegation: listen for clicks on any button marked as back (original or clone)
document.addEventListener('click', function (e) {
	const btn = e.target.closest && e.target.closest('button');
	if (!btn) return;
	if (btn.dataset && btn.dataset.role === 'back') {
		console.debug('[delegated click] back button clicked via data-role, id=', btn.id, 'btn=', btn);
		handleBackAction(e);
	}
});

	// Keep label classes in sync when radios change by keyboard or scripts
	radios.forEach(r => {
		r.addEventListener('change', () => {
			labels.forEach(l => {
				const fid = l.getAttribute('for');
				const ri = document.getElementById(fid);
				const panel = l.nextElementSibling && l.nextElementSibling.classList.contains('type-panel') ? l.nextElementSibling : null;
				if (ri && ri.checked) {
					l.classList.add('expanded');
					if (panel) panel.classList.add('open');
				} else {
					l.classList.remove('expanded');
					if (panel) panel.classList.remove('open');
				}
			});
		});
	});

	// --- Data for State Panels ---
	const stateData = {
		'amazonas': [
			'C.C. El Monstruo',
			'C.C. Las Maravilla',
			'Parque Comercial Amazonia'
		],
		'anzoategui': [
			'C.C. Plaza Mayor',
			'C.C. Puente Real'
		],
		'apure': [
			'C.C. Ayah'
		],
		'aragua': [
			'Central Station Mall',
			'C.C. Las Américas',
			'C.C. Parque Aragua',
			'C.C. Parque Los Aviadores',
			'Palma Center'
		],
		'barinas': [
			'C.C. El Dorado',
			'C.C. El Marqués'
		],
		'bolivar': [
			'C.C. Ciudad Alta Vista I',
			'C.C. Ciudad Alta Vista II',
			'C.C. Ikabarú',
			'Orinokia Mall'
		],
		'carabobo': [
			'Central Madeirense Express (Naguanagua)',
			'C.C. Metrópolis',
			'C.C. Paseo Las Industrias',
			'C.C. Sambil Valencia',
			'C.C. Mango Shopping Naguanagua'
		],
		'cojedes': [
			'C.C. Gran San Antonio'
		],
		'delta-amacuro': [
			'No se dispone de un listado amplio de centros comerciales, pero se destaca la presencia de tiendas como Deco Center en Tucupita.'
		],
		'distrito-capital': [
			'C.C. Ciudad Tamanaco (CCCT)',
			'C.C. El Recreo',
			'C.C. Líder',
			'C.C. Millennium Mall',
			'C.C. Sambil Caracas',
			'C.C. Tolón Fashion Mall'
		],
		'falcon': [
			'C.C. Costa Azul',
			'C.C. Las Virtudes',
			'Coro Mall',
			'Paraguaná Mall',
			'Sambil Paraguaná'
		],
		'guarico': [
			'C.C. La Pascua',
			'C.C. Traki (Valle de la Pascua)'
		],
		'la-guaira': [
			'C.C. Multicentro Maiquetía',
			'C.C. Plaza Mayor'
		],
		'lara': [
			'C.C. Las Trinitarias',
			'C.C. Los Cardones',
			'Centro Sambil Barquisimeto'
		],
		'merida': [
			'C.C. Alto Prado',
			'C.C. Las Tapias',
			'C.C. Millenium',
			'C.C. Plaza Mayor',
			'C.C. Rodeo Plaza',
			'C.C. La Candelaria'
		],
		'miranda': [
			'C.C. La Cascada',
			'C.C. Lider',
			'C.C. Parque Cerro Verde',
			'C.C. Paseo El Hatillo',
			'C.C. Plaza Miranda'
		],
		'monagas': [
			'C.C. La Cascada',
			'C.C. Monagas Plaza'
		],
		'nueva-esparta': [
			'C.C. La Vela',
			'C.C. Mercado La Isla',
			'CC. Rattan Plaza',
			'C.C. Sambil Margarita'
		],
		'portuguesa': [
			'C.C. Buenaventura',
			'Ciudad Comercial Llano Mall'
		],
		'sucre': [
			'C.C. Marina Plaza',
			'C.C. Sucre'
		],
		'tachira': [
			'C.C. Sambil San Cristóbal'
		],
		'trujillo': [
			'C.C. Plaza',
			'C.C. Trujillo'
		],
		'yaracuy': [
			'C.C. San Felipe Plaza'
		],
		'zulia': [
			'C.C. Costa Verde',
			'C.C. Doral Mall',
			'C.C. Galerías Mall',
			'C.C. LagoMall',
			'C.C. San Vill',
			'C.C. Sambil Maracaibo'
		]
	};

	// --- Populate Panels with State Data ---
	try {
		labels.forEach(label => {
			const stateId = label.getAttribute('for');
			const panel = label.nextElementSibling;
			const locations = stateData[stateId];

			if (panel && panel.classList.contains('type-panel') && locations) {
				// Clear existing rows
				panel.innerHTML = '';

				// Create and append new rows
				locations.forEach(locationText => {
					const row = document.createElement('div');
					row.className = 'row';
					row.tabIndex = 0;
					row.textContent = locationText;
					panel.appendChild(row);
				});
			}
		});
	} catch (err) {
		console.error("Error populating state panels:", err);
	}

	// --- Footer Icon Navigation ---
	// helper: activate footer icon by aria-label or visible text
	function activateFooterByLabel(label) {
		try {
			const footerIconsContainer = document.querySelector('.footer-icons');
			if (!footerIconsContainer) return;
			const links = Array.from(footerIconsContainer.querySelectorAll('.footer-link'));
			let target = links.find(l => (l.getAttribute('aria-label') || '').toLowerCase() === (label || '').toLowerCase());
			if (!target) {
				// try matching by visible span/text
				target = links.find(l => (l.textContent || '').trim().toLowerCase() === (label || '').toLowerCase());
			}
			if (!target) return;
			const img = target.querySelector('img');
			if (!img) return;
			// restore previous
			if (window._activeFooterLink && window._activeFooterLink !== target) {
				const prevImg = window._activeFooterLink.querySelector('img');
				if (prevImg) {
					const orig = prevImg.dataset && prevImg.dataset.origSrc ? prevImg.dataset.origSrc : prevImg.getAttribute('src');
					if (orig) prevImg.setAttribute('src', orig);
				}
			}
			// set new
			const blue = img.dataset && img.dataset.blueSrc ? img.dataset.blueSrc : (img.getAttribute('src') || '').replace(/\.png$/i, '_blue.png');
			if (blue) img.setAttribute('src', blue);
						// set span color for active
						try {
							const span = target.querySelector('span');
							if (span) span.style.color = '#26a9e1';
							// ensure previous active span is restored
							if (window._activeFooterLink && window._activeFooterLink !== target) {
								const prevSpan = window._activeFooterLink.querySelector('span');
								if (prevSpan && prevSpan.dataset && prevSpan.dataset.origColor) {
									prevSpan.style.color = prevSpan.dataset.origColor;
								} else if (prevSpan) {
									prevSpan.style.color = '';
								}
							}
						} catch (err) {}
						window._activeFooterLink = target;
		} catch (err) { console.debug('activateFooterByLabel error', err); }
	}

	try {
		// Use delegation to ensure clicks are handled even if nodes are replaced.
		const footerIconsContainer = document.querySelector('.footer-icons');
		window._activeFooterLink = window._activeFooterLink || null;
		// initialize original and blue src for each footer img
		if (footerIconsContainer) {
			const imgs = footerIconsContainer.querySelectorAll('.footer-link img');
			imgs.forEach(img => {
				try {
					const orig = img.getAttribute('src') || img.src || '';
					img.dataset.origSrc = orig;
					img.dataset.blueSrc = orig.replace(/\.png$/i, '_blue.png');
					// store original color of the associated text span
					try {
						const link = img.closest && img.closest('.footer-link');
						if (link) {
							const span = link.querySelector('span');
							if (span) {
								const cs = window.getComputedStyle(span);
								span.dataset.origColor = cs && cs.color ? cs.color : 'white';
							}
						}
					} catch (err) {}
				} catch (err) {}
			});
		}
		if (footerIconsContainer) {
			// delegating click handler
			footerIconsContainer.addEventListener('click', function (e) {
				e.preventDefault();
				const link = e.target.closest && e.target.closest('.footer-link');
				if (!link) return;
				const label = link.getAttribute('aria-label') || (link.textContent && link.textContent.trim());
				// Debug log
				try { console.debug('[footer click] label=', label); } catch (err) {}
				// set header immediately
				try {
					const headerH1 = document.querySelector('header h1');
					if (headerH1) {
						const strong = headerH1.querySelector('strong');
						const titleMap = {
							'Cartelera': 'Cartelera',
							'Cines': 'Cines',
							'Formato': 'Formato',
							'Estrenos': 'Estrenos',
							'Info': 'Cuenta',
							'Cuenta': 'Cuenta'
						};
						const newTitle = titleMap[label] || label || 'Ciudad';
						if (strong) strong.textContent = newTitle; else headerH1.textContent = newTitle;
					}
				} catch (err) {}
				// icon swap: restore previous and set new
				try {
					const img = link.querySelector('img');
					if (img) {
						if (window._activeFooterLink && window._activeFooterLink !== link) {
							const prevImg = window._activeFooterLink.querySelector('img');
							const prevSpan = window._activeFooterLink.querySelector('span');
							if (prevImg && prevImg.dataset && prevImg.dataset.origSrc) {
								prevImg.setAttribute('src', prevImg.dataset.origSrc);
							}
							if (prevSpan && prevSpan.dataset && prevSpan.dataset.origColor) {
								prevSpan.style.color = prevSpan.dataset.origColor;
							} else if (prevSpan) {
								prevSpan.style.color = '';
							}
						}
						// set current to blue (if available) and change text color
						const span = link.querySelector('span');
						if (img.dataset && img.dataset.blueSrc) img.setAttribute('src', img.dataset.blueSrc);
						if (span) span.style.color = '#26a9e1';
						window._activeFooterLink = link;
					}
				} catch (err) {}
				// call the relevant action
				switch ((label || '').toLowerCase()) {
					case 'cartelera': goToForm2(); break;
					case 'cines': showCinesView(); break;
					case 'formato': showFormatoView(); break;
					case 'estrenos': showEstrenosView(); break;
					case 'info':
					case 'cuenta': showAccountView(); break;
					default: break;
				}
			});
		}
	} catch(err) { console.error("Error setting up footer navigation:", err); }
});

// Twitter: @davidkpiano