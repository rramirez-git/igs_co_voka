let svg_ids = []

let get_svg_ids = () => {
    let svg = document.querySelector(`div#svg-product-container svg`);
    if(!svg) { return false; }
    svg_ids = Array.from(svg.querySelectorAll(`[id]`)).map(item => item.id);
    let options = svg_ids.map(opt => `<option value="${opt}"></option>`);
    $(document.body).append($(
        `<datalist id="svp_option_id">${options.join("")}</datalist>`));
}

let create_parte_producto = extra => {
    openPanel($(`#parte-form-template`).html(), "Nueva Parte");
    $(`#main-form-parte input[name="action"]`).val('create-parte');
    $(`#main-form-parte input[name="extra"]`).val(extra);
}

let update_parte_producto = extra =>{
    openPanel($(`#parte-form-template`).html(), "Actualizar Parte");
    let data = $(`#parte-${extra}`)[0].dataset;
    $(`#main-form-parte input[name="action"]`).val('update-parte');
    $(`#main-form-parte input[name="extra"]`).val(extra);
    $(`#main-form-parte input[name="nombre"]`).val(data.nombre);
    $(`#main-form-parte input[name="posicion"]`).val(data.posicion);
    $(`#main-form-parte select[name="tipo_de_parte"]`).val(data.tipo);
    for(let pk of data.paletas.split(',')){
        if(pk && parseInt(pk) > 0) {
            $(`#main-form-parte input[name="paletas_de_color"][value="${pk}"]`).attr('checked', true);
        }
    }
};

let delete_parte_producto = extra =>{
    openPanel($(`#deleting-many-confirmation-template`).html(), "Confirmación de Eliminación");
    let btn = $(`#modal-panel-message button[type="submit"]`);
    let lbl = btn.html();
    let cell = btn.parent();
    btn.remove();
    cell.append($(`<button type="button" onclick="delete_parte_producto_execute(${extra})" class="btn btn-outline-secondary" title="Aceptar">${lbl}</button>`));
};

let delete_parte_producto_execute = (extra) =>{
    let token = $(`#frm-csrfmiddlewaretoken input[name="csrfmiddlewaretoken"]`).val();
    let frm = $(`
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
            <input type="hidden" name="action" value="delete-parte" />
            <input type="hidden" name="extra" id="extra" value="${extra}" />
        </form>`);
    $(document.body).append(frm);
    frm.submit();
};

let create_campo_parte_producto = extra => {
    openPanel($(`#campo-form-template`).html(), "Nuevo Campo");
    $(`#main-form-campo input[name="action"]`).val('create-campo');
    $(`#main-form-campo input[name="extra"]`).val(extra);
}

let update_campo_parte_producto = extra => {
    openPanel($(`#campo-form-template`).html(), "Actualizar Campo");
    let data = $(`#campo-${extra}`)[0].dataset;
    $(`#main-form-campo input[name="action"]`).val('update-campo');
    $(`#main-form-campo input[name="extra"]`).val(extra);
    $(`#main-form-campo input[name="nombre"]`).val(data.nombre);
    $(`#main-form-campo input[name="id_svg"]`).val(data.idsvg);
    $(`#main-form-campo input[name="posicion"]`).val(data.posicion);
    $(`#main-form-campo select[name="tipo_de_campo"]`).val(data.tipocampo);
    $(`#main-form-campo select[name="opciones_material"]`).val(data.opcionesmaterial);
    $(`#main-form-campo select[name="opciones_color"]`).val(data.opcionescolor);
}

let delete_campo_parte_producto = extra =>{
    openPanel($(`#deleting-many-confirmation-template`).html(), "Confirmación de Eliminación");
    let btn = $(`#modal-panel-message button[type="submit"]`);
    let lbl = btn.html();
    let cell = btn.parent();
    btn.remove();
    cell.append($(`<button type="button" onclick="delete_campo_parte_producto_execute(${extra})" class="btn btn-outline-secondary" title="Aceptar">${lbl}</button>`));
};

let delete_campo_parte_producto_execute = (extra) =>{
    let token = $(`#frm-csrfmiddlewaretoken input[name="csrfmiddlewaretoken"]`).val();
    let frm = $(`
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
            <input type="hidden" name="action" value="delete-campo" />
            <input type="hidden" name="extra" id="extra" value="${extra}" />
        </form>`);
    $(document.body).append(frm);
    frm.submit();
};

let create_grupo_parte_producto = extra => {
    openPanel($(`#grupo-form-template`).html(), "Nuevo Grupo de Campos");
    $(`#main-form-campo input[name="action"]`).val('create-grupo');
    $(`#main-form-campo input[name="extra"]`).val(extra);
}

let update_grupo_parte_producto = extra => {
    openPanel($(`#grupo-form-template`).html(), "Actualizar Grupo de Campos");
    let data = $(`#grupo-${extra}`)[0].dataset;
    $(`#main-form-campo input[name="action"]`).val('update-grupo');
    $(`#main-form-campo input[name="extra"]`).val(extra);
    $(`#main-form-campo input[name="nombre"]`).val(data.nombre);
    $(`#main-form-campo input[name="posicion"]`).val(data.posicion);
}

let delete_grupo_parte_producto = extra =>{
    openPanel($(`#deleting-many-confirmation-template`).html(), "Confirmación de Eliminación");
    let btn = $(`#modal-panel-message button[type="submit"]`);
    let lbl = btn.html();
    let cell = btn.parent();
    btn.remove();
    cell.append($(`<button type="button" onclick="delete_grupo_parte_producto_execute(${extra})" class="btn btn-outline-secondary" title="Aceptar">${lbl}</button>`));
};

let delete_grupo_parte_producto_execute = (extra) =>{
    let token = $(`#frm-csrfmiddlewaretoken input[name="csrfmiddlewaretoken"]`).val();
    let frm = $(`
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
            <input type="hidden" name="action" value="delete-grupo" />
            <input type="hidden" name="extra" id="extra" value="${extra}" />
        </form>`);
    $(document.body).append(frm);
    frm.submit();
};

let shown_categories = Array()

let check_show_productos = (pk) => {
    if(pk > 0) {
        if (shown_categories.includes(pk)) {
            shown_categories = shown_categories.filter(item => item !== pk);
            $(`#mnu-cat-opc-${pk} input[type="checkbox"]`).attr('checked', false);
        } else {
            shown_categories.push(pk);
            $(`#mnu-cat-opc-${pk} input[type="checkbox"]`).attr('checked', true);
        }
    }
    let cards = $(`[id^="productos-table-"] div.producto`);
    let txt_find = $(`#txt_find`).val().trim().toUpperCase();
    if(shown_categories.length === 0) {
        cards.removeClass('d-none')
        if(txt_find) {
            Array.from(cards).filter(
                card => !($(card).text().trim().toUpperCase().includes(txt_find))
            ).forEach(card => $(card).addClass('d-none'));
        }
    } else {
        cards.addClass('d-none');
        Array.from(cards).filter(card => {
            let categs = card.dataset.categorias.split(", ").map(value => parseInt(value));
            return categs.filter(c => shown_categories.includes(c)).length > 0;
        }).forEach(card => $(card).removeClass('d-none'));
        if(txt_find) {
            Array.from(cards).filter(
                card => $(card).text().trim().toUpperCase().includes(txt_find)
            ).forEach(card => $(card).removeClass('d-none'));
        }
    }
    $(`#accordionCategorias .accordion-item`).each((idx,item) => {
        $(item).removeClass('d-none');
        if($(item).find(`div.producto`).length - $(item).find(`div.producto.d-none`).length == 0){
            $(item).addClass('d-none');
        }})
}

let personalizar_producto_open_panel = () => {
    let pk = pp_pk;
    let nombre = pp_nombre;
    openPanel($(`#producto-personalizacion-${pk}-template`).html(), `Personalizar ${nombre}`);
    const el = document.getElementById('modal-panel-message');
    el.addEventListener('shown.bs.modal', () => {
        const dialog = el.querySelector('.modal-dialog');
        dialog.classList.add('modal-dialog-scrollable');
    }, { once: true });
    (async function () {
        await colEvokaPers.findById(pk).then(objeto => {
            if (typeof objeto === "undefined") {
                colEvokaPers.insert(crea_registro(pk));
            }
        }).catch(() => {
            colEvokaPers.insert(crea_registro(pk));
        });
        await colEvokaPers.findById(pk).then(recupera_personalizacion);
    })();
}

let pp_pk = null;
let pp_nombre = null;

let personalizar_producto = (pk, nombre, svg_url) => {
    pp_pk = pk;
    pp_nombre = nombre;
    pp_svg_url = svg_url;
    openPanel("Cargando Modelo para personalizar", "Cargando...", false, null, 'modal_message_loading');
    $.get(svg_url, (svg_xml) => {
        setTimeout(() => {
            closePanel('modal_message_loading', personalizar_producto_open_panel);
        }, 1 * 1000);
    }).fail(() => {
        closePanel('modal_message_loading');
        alert("Error al cargar Modelo");
    });
}

let paletas_user = {'paletas': 'colores'};

let update_paletas_user = (parte, paleta, color, color_pk, obj, paleta_name, color_name, color_code) => {
    if(obj.checked) {
        if(! paletas_user[parte]){
            paletas_user[parte] = {'parte': parte}
        }
        if(! paletas_user[parte][paleta]){
            paletas_user[parte][paleta] = {'paleta': paleta, 'colores': Array()}
        }
        paletas_user[parte][paleta]['colores'].push(color);
    } else {
        paletas_user[parte][paleta]['colores'] = paletas_user[parte][paleta]['colores'].filter(c => c !== color);
    }
    let paleta_user = $(`#paleta-parte-${ parte }`);
    if(obj.checked) {
        let radio_value = `${color}||${color_name}||${color_code}`;
        let label_content = `<div class="d-inline-block muestra-color rounded" style="background-color: ${ color };"></div>`;
        let label = `<label class="border-0 btn btn-outline-secondary" for="btn-radio-color-${ color_pk }-paleta-usuario" title="${paleta_name} - ${color_name}">${label_content}</label>`;
        let radio = `<input type="radio" class="btn-check" name="paleta-parte-${ parte }-color-opc" id="btn-radio-color-${ color_pk }-paleta-usuario" value="${ radio_value }" autocomplete="off" />`;
        paleta_user.append($(radio));
        paleta_user.append($(label));
    } else {
        $(`#paleta-parte-${ parte } label[for="btn-radio-color-${ color_pk }-paleta-usuario"]`).remove();
        $(`#paleta-parte-${ parte } input#btn-radio-color-${ color_pk }-paleta-usuario`).remove();
    }
};

let update_picture_color = (check, pkparte, id_svg) => {
    let color_checked = Array.from($(`input[name="paleta-parte-${pkparte}-color-opc"]`)).filter(radio => radio.checked);
    check.checked = false;
    if(color_checked.length == 0) {
        alert("Debe seleccionar al menos un color de la paleta de colores para personalizar el producto.");
        return false;
    }
    let div_color = $(`label[for="${color_checked[0].id}"] div.muestra-color`)[0];
    let color_text = div_color.style.backgroundColor;
    check.value = color_checked[0].value;
    let div_color_campo = $(`label[for="${check.id}"] div.muestra-color`)[0];
    div_color_campo.style.backgroundColor = color_text;
        let svg_object = $(`#producto-svg object`)[0].contentDocument;
    let svg_item = svg_object.getElementById(id_svg);
    svg_item.style.fill=color_text;
}

let update_picture_color_2 = (input, id_svg) => {
    if(id_svg) {
        let svg_object = $(`#producto-svg object`)[0].contentDocument;
        let svg_item = svg_object.getElementById(id_svg);
        svg_item.style.fill = input.value;
    }
}

let update_selectable_values_label = () => $(`#label-producto-personalizado`).html(
    Array.from($(`form#producto-personalizacion-form input.selectable-value`)).filter(
        input => input.checked).map(input => input.value).join(","));

let update_color_fields = () => {
    let pk = parseInt($("#producto-personalizacion-form #producto_pk").val());
    let campos_color = Object();
    Array.from($(`form#producto-personalizacion-form input[type="checkbox"][name^="campo-"]`)).forEach(
        input => campos_color[input.name] = input.value);
    $('form#producto-personalizacion-form input#campos_color').val(JSON.stringify(campos_color));
    window.setTimeout(() => {
        closePanel();
        window.setTimeout(() => {
            openPanel(
                'En un momento comenzará la descarga del formato para el producto personalizado',
                'Descargando...');
            colEvokaPers.delete(pk);
        }, 1 *1000);
    }, 1 * 1000);
    return true;
}

let dbEvoka = new DBIndex("evoka");
dbEvoka.add_collection("personalizacion", "id", false);
dbEvoka.open();
let colEvokaPers = dbEvoka.collections["personalizacion"];
let objeto_personalizacion_pendiente = false;

let crea_registro = (pk, completado=false) => {
    const form = $('#producto-personalizacion-form')[0];
    if (!form) return;
    const campos = {};
    const colores = {};

    form.querySelectorAll('input[type="checkbox"][id^="btn-check-color-"]').forEach((el) => {
        if (el.id) colores[el.id] = el.checked;
    });
    form.querySelectorAll('input[type="radio"][name^="campo-"]').forEach((el) => {
        if (el.id) campos[el.id] = el.checked;
    });
    form.querySelectorAll('input[type="checkbox"][name^="campo-"]').forEach((el) => {
        if (el.id) campos[el.id] = el.value;
    });
    form.querySelectorAll('input[type="color"][name^="campo-"]').forEach((el) => {
        if (el.id) campos[el.id] = el.value;
    });
    form.querySelectorAll('textarea[name^="campo-"]').forEach((el) => {
        if (el.id) campos[el.id] = el.value;
    });

    return {
        id: parseInt(pk),
        campos,
        colores,
        timestamp: Date.now(),
        completado
    };
}

let recupera_personalizacion = registro => {
    Object.entries(registro.campos).forEach(([id, valor]) => {
        let objeto = $(`#${id}`);
        if(!valor) {
            return;
        }
        if(objeto[0].nodeName.toLowerCase().trim() === "textarea") {
            $(objeto).val(valor);
        } else if(objeto[0].nodeName.toLowerCase().trim() === "input") {
            if(objeto.attr('type').toLowerCase().trim() === "radio") {
                $(objeto).attr('checked', true);
            } else if(objeto.attr('type').toLowerCase().trim() === "color") {
                $(objeto).val(valor);
            } else if(objeto.attr('type').toLowerCase().trim() === "checkbox") {
                $(objeto).val(valor);
            }
        }
    });
    Object.entries(registro.colores).filter(
        ([btnid, activated]) => activated).forEach(
            ([btnid, activated]) => $(`#${btnid}`).trigger("click"));
    objeto_personalizacion_pendiente = Object.entries(registro.campos);
}

let check_personalizacion_pendiente = () => {
    if(objeto_personalizacion_pendiente) {
        objeto_personalizacion_pendiente.forEach(([id, valor]) => {
            let objeto = $(`#${id}`);
            if(!valor) {
                return;
            }if(objeto[0].nodeName.toLowerCase().trim() === "input" && objeto.attr('type').toLowerCase().trim() === "checkbox" && valor.split("||").length===3) {
                $(`input[type="radio"][value="${valor}"]`).attr('checked', true);
            }
            objeto.trigger('change');
        });
        objeto_personalizacion_pendiente = false;
    }
}

let actualiza_personalizacion = () => {
    let pk = parseInt($("#producto-personalizacion-form #producto_pk").val());
    colEvokaPers.update(pk, crea_registro(pk));
}

window.addEventListener('DOMContentLoaded', evt => {
    get_svg_ids();
});
