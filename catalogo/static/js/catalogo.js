let update_tipocolor_opcion = () => {
    cbk = Array.from($(`#main-data-table input[type="checkbox"]`)).filter(item => item.checked);
    if(cbk.length > 0) {
        let id = cbk[0].value;
        let nombre = $(cbk[0]).parent().parent().find("td:nth-child(2)").text();
        let color = $(cbk[0]).parent().parent().find("td:nth-child(3)").text();
        let codigo = $(cbk[0]).parent().parent().find("td:nth-child(4)").text();
        openPanel($(`#opcion-form-template`).html(), "Actualizar Opción");
        $(`#main-form-option input[name="action"]`).val('update');
        $(`#main-form-option input[name="nombre"]`).val(nombre);
        $(`#main-form-option input[name="color"]`).val(color);
        $(`#main-form-option input[name="codigo"]`).val(codigo);
        $(`#main-form-option #extra`).val(id);
    }
}

let update_tipomaterial_opcion = () => {
    cbk = Array.from($(`#main-data-table input[type="checkbox"]`)).filter(item => item.checked);
    if(cbk.length > 0) {
        let id = cbk[0].value;
        let material = $(cbk[0]).parent().parent().find("td:nth-child(2)").text();
        openPanel($(`#opcion-form-template`).html(), "Actualizar Opción");
        $(`#main-form-option input[name="action"]`).val('update')
        $(`#main-form-option input[name="material"]`).val(material)
        $(`#main-form-option #extra`).val(id);
    }
}
