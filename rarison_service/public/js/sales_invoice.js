frappe.ui.form.on('Sales Invoice',{
    refresh: function(frm, cdt, cdn){
        get_sales_invoice(frm, cdt, cdn)
    }
});

function get_sales_invoice(frm, cdt, cdn){
    cur_frm.add_custom_button(__("Fetch Spare Invoice"), function(){
        frappe.prompt({
            label: 'Spare Sales Invoice No',
            fieldname: 'sinv',
            fieldtype: 'Data'
        }, (values) => {
            frappe.call({
                'method' : 'rarison_service.api.sales_invoice.fetch_spare_invoice',
                'args' : {
                    'sinv' : values.sinv
                },
                callback: function(r){
                    if(r.message.hasOwnProperty('exc_type')){
                        if(r.message.exc_type == 'DoesNotExistError'){
                            cur_frm.clear_table("spares_used")

                            frm.set_value("spare_invoice", "")
                            frm.set_value("spare_net","")
                            frm.set_value("spare_tax","")
                            frm.set_value("spare_discount","")
                            frm.set_value("spare_grand_total","")
                            frm.set_value("spare_rounded_total","")
                            frm.set_value("spare_in_words", "")

                            frappe.msgprint("Invoice Does Not Exist")
                        }
                    }
                    else if ( r.message.message.docstatus != 1){
                        cur_frm.clear_table("spares_used")

                        frm.set_value("spare_invoice", "")
                        frm.set_value("spare_net","")
                        frm.set_value("spare_tax","")
                        frm.set_value("spare_discount","")
                        frm.set_value("spare_grand_total","")
                        frm.set_value("spare_rounded_total","")
                        frm.set_value("spare_in_words", "")

                        frappe.msgprint("Invoice Not In Submitted State")
                    }
                    else {
                        cur_frm.clear_table("spares_used")
                        frm.set_value("spare_invoice", values.sinv )

                        frm.set_value("spare_net",r.message.message.net_total)
                        frm.set_value("spare_tax",r.message.message.total_taxes_and_charges)
                        frm.set_value("spare_discount",r.message.message.discount_amount)
                        frm.set_value("spare_grand_total",r.message.message.grand_total)
                        frm.set_value("spare_rounded_total",r.message.message.rounded_total)
                        frm.set_value("spare_in_words",r.message.message.in_words)
                        
                        r.message.message.items.forEach(item => {
                            var child = cur_frm.add_child("spares_used")
                            frappe.model.set_value(child.doctype, child.name, 'part_no', item.part_number)
                            frappe.model.set_value(child.doctype, child.name, 'description', item.item_name)
                            frappe.model.set_value(child.doctype, child.name, 'qty', item.qty)
                            frappe.model.set_value(child.doctype, child.name, 'rate', item.rate)
                            frappe.model.set_value(child.doctype, child.name, 'total', item.amount)
                        });
                    }
                    frm.refresh_fields()
                }
            })
        })
    })
}