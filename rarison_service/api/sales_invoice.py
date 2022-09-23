import frappe
import requests
import json

@frappe.whitelist()
def fetch_spare_invoice(sinv):
    server_url = frappe.db.get_single_value('Rarison Service Settings', 'sales_server_link')
    token = frappe.db.get_single_value('Rarison Service Settings', 'sales_server_access_token')
    https = frappe.db.get_single_value('Rarison Service Settings', 'https_or_http')

    url = https + '://'+server_url+'/api/method/rarison_motors.api.sales_invoice.sales_inv_api'

    headers = {
        "Authorization": token
    }
    body = {
        "sinv" : sinv
    }
    r = requests.post(url, headers=headers, json=body)

    return_data = json.loads(r.content)
    return return_data