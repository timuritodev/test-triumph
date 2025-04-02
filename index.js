import tinymce from 'tinymce/tinymce';
window.tinymce = tinymce;

tinymce.baseURL = '/test-triumph/tinymce';

import 'tinymce/icons/default';
import 'tinymce/plugins/code';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/themes/silver';

let templates = ['template'];

function updateSpecialComponents(editor) {
	const content = editor.getBody();
	if (!content) return;

	const components = content.querySelectorAll('.special-component');
	components.forEach((component) => {
		const selectedTemplate = component.getAttribute('data-template');
		if (!templates.includes(selectedTemplate)) {
			component.innerHTML = 'ERROR';
			return;
		}

		let selectHtml = '<select class="component-select">';
		templates.forEach((t) => {
			selectHtml += `<option value="${t}" ${
				t === selectedTemplate ? 'selected' : ''
			}>${t}</option>`;
		});
		selectHtml += '</select>';

		component.innerHTML = selectHtml;
		const selectElem = component.querySelector('.component-select');

		selectElem.addEventListener('change', function (e) {
			component.setAttribute('data-template', e.target.value);
		});
	});
}

tinymce.init({
	selector: '#editor',
	height: 400,
	plugins: 'lists link table code',
	toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
	setup: function (editor) {
		editor.on('NodeChange', () => {
			updateSpecialComponents(editor);
		});

		document.getElementById('insert-btn').addEventListener('click', () => {
			if (editor) {
				editor.focus();
				const lastTemplate = templates[templates.length - 1] || 'template';
				const componentHtml = `<span contenteditable="false" class="special-component" data-template="${lastTemplate}">
					<select class="component-select">
						${templates
							.map(
								(t) =>
									`<option value="${t}" ${
										t === lastTemplate ? 'selected' : ''
									}>${t}</option>`
							)
							.join('')}
					</select>
				</span>`;

				setTimeout(() => {
					editor.execCommand('mceInsertContent', false, componentHtml);
					updateSpecialComponents(editor);
				}, 0);
			}
		});
	},
});

function renderTemplateList() {
	const listContainer = document.getElementById('template-list');
	listContainer.innerHTML = '';
	templates.forEach((temp, index) => {
		const div = document.createElement('div');
		div.className = 'template-item';
		div.textContent = temp;
		div.dataset.index = index;
		div.addEventListener('click', () => {
			document
				.querySelectorAll('.template-item')
				.forEach((item) => item.classList.remove('selected'));
			div.classList.add('selected');

			const editInput = document.getElementById('edit-template');
			if (document.activeElement !== editInput) {
				editInput.value = temp;
			}
		});
		listContainer.appendChild(div);
	});
}

function safeUpdateEditor() {
	if (tinymce.activeEditor) {
		setTimeout(() => {
			try {
				tinymce.activeEditor.fire('NodeChange');
			} catch (e) {
				console.warn('Ошибка при обновлении редактора:', e);
			}
		}, 100);
	}
}

document.getElementById('add-template').addEventListener('click', () => {
	templates.push(`template ${templates.length + 1}`);
	renderTemplateList();
	safeUpdateEditor();
});

document.getElementById('remove-template').addEventListener('click', () => {
	const selectedItem = document.querySelector('.template-item.selected');
	if (selectedItem) {
		const index = parseInt(selectedItem.dataset.index, 10);
		templates.splice(index, 1);
		renderTemplateList();
		safeUpdateEditor();
	}
});

function updateTemplate(newValue) {
	const selectedItem = document.querySelector('.template-item.selected');
	if (selectedItem) {
		const index = parseInt(selectedItem.dataset.index, 10);
		templates[index] = newValue;
		renderTemplateList();
		safeUpdateEditor();
	}
}
document.getElementById('edit-template').addEventListener('blur', (e) => {
	updateTemplate(e.target.value);
});
document.getElementById('edit-template').addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		updateTemplate(e.target.value);
		e.target.blur();
	}
});

renderTemplateList();
