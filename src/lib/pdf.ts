import"server-only";import React from"react";import{Document,Page,StyleSheet,Text,View,renderToBuffer}from"@react-pdf/renderer";const styles=StyleSheet.create({page:{padding:40,fontSize:10,color:"#1c2723"},header:{fontSize:24,marginBottom:20,color:"#173f35"},row:{flexDirection:"row",justifyContent:"space-between",paddingVertical:6,borderBottom:"1 solid #e1e1e1"},total:{fontSize:16,marginTop:18,textAlign:"right"},muted:{color:"#68736e",marginBottom:5}});export async function invoicePdf(data:Record<string,unknown>){const snap=data.snapshot as Record<string,Record<string,unknown>>|undefined;const pricing=snap?.pricing||{};return renderToBuffer(React.createElement(Document,null,React.createElement(Page,{size:"A4",style:styles.page},React.createElement(Text,{style:styles.header},"MANZSA RESIDENCE"),React.createElement(Text,{style:styles.muted},`Invoice ${String(data.invoiceNumber||"")}`),React.createElement(Text,{style:styles.muted},`Tenant: ${String(snap?.tenant?.fullName||"")}`),React.createElement(Text,{style:styles.muted},`Kamar: ${String(snap?.room?.name||"")}`),...[["Subtotal",data.subtotal],["Deposit",data.depositAmount],["Biaya tambahan",data.additionalAmount],["Diskon",data.discountAmount]].map(([a,b])=>React.createElement(View,{style:styles.row,key:String(a)},React.createElement(Text,null,String(a)),React.createElement(Text,null,format(Number(b||0))))),React.createElement(Text,{style:styles.total},`TOTAL ${format(Number(data.totalAmount||pricing.total||0))}`),React.createElement(Text,{style:{...styles.muted,marginTop:28}},`Status: ${String(data.status||"").toUpperCase()}`))))}const format=(n:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

export async function paymentReceiptPdf(payment: Record<string, unknown>, invoice: Record<string, unknown>) {
  const snapshot = invoice.snapshot as Record<string, Record<string, unknown>> | undefined;
  const paidAt = payment.paidAt as { toDate?: () => Date } | Date | undefined;
  const paidDate = paidAt && "toDate" in paidAt && paidAt.toDate ? paidAt.toDate() : paidAt;
  const rows = [
    ["Nomor invoice", invoice.invoiceNumber],
    ["Tenant", snapshot?.tenant?.fullName],
    ["Kamar", snapshot?.room?.name],
    ["Metode", payment.method === "manual_transfer" ? "Transfer manual" : "Midtrans"],
    ["Referensi", payment.providerTransactionId || payment.providerOrderId || "-"],
    ["Tanggal dibayar", paidDate instanceof Date ? paidDate.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : "-"],
  ];
  return renderToBuffer(React.createElement(Document, null,
    React.createElement(Page, { size: "A5", style: styles.page },
      React.createElement(Text, { style: styles.header }, "BUKTI PEMBAYARAN"),
      React.createElement(Text, { style: styles.muted }, "Manzsa Residence"),
      ...rows.map(([label, value]) => React.createElement(View, { style: styles.row, key: String(label) }, React.createElement(Text, null, String(label)), React.createElement(Text, null, String(value || "-")))),
      React.createElement(Text, { style: styles.total }, `LUNAS ${format(Number(payment.amount || invoice.totalAmount || 0))}`),
      React.createElement(Text, { style: { ...styles.muted, marginTop: 28 } }, "Struk ini dibuat otomatis setelah pembayaran terverifikasi."),
    ),
  ));
}
