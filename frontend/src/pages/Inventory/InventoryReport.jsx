import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryReport = ({ filteredInventories }) => {
    const generatePDF = () => {
        const doc = new jsPDF();
        const tableColumn = [
            "No",
            "Item No",
            "Item Name",
            "Category",
            "Quantity",
            "Price",
            "Supplier Name",
            "Supplier Email"
        ];
        const tableRows = [];

        filteredInventories.forEach((inventoryItem, index) => {
            const data = [
                index + 1,
                inventoryItem.ItemNo,
                inventoryItem.ItemName,
                inventoryItem.Category,
                inventoryItem.Quantity,
                inventoryItem.Price,
                inventoryItem.SupplierName,
                inventoryItem.SupplierEmail
            ];
            tableRows.push(data);
        });

        const date = new Date().toLocaleDateString();

        doc.setFontSize(24).setFont("helvetica", "bold").setTextColor("#4B9CD3");
        doc.text("Saloon Management", 105, 15, { align: "center" });

        doc.setFont("helvetica", "normal").setFontSize(18).setTextColor("#333");
        doc.text("Inventory Details Report", 105, 25, { align: "center" });

        doc.setFont("helvetica", "italic").setFontSize(12).setTextColor("#666");
        doc.text(`Report Generated Date: ${date}`, 105, 35, { align: "center" });

        doc.setFont("helvetica", "normal").setFontSize(10).setTextColor("#999");
        doc.text(
            "Saloon, Gampaha",
            105,
            45,
            { align: "center" }
        );

        doc.setDrawColor(0, 0, 0).setLineWidth(0.5);
        doc.line(10, 49, 200, 49);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: {
                fillColor: [44, 62, 80],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [230, 230, 230]
            },
            margin: { top: 60 }
        });

        doc.save(`Inventory-Details-Report_${date}.pdf`);

        // Send email alert to inventory manager
        const emailSubject = encodeURIComponent('Inventory Report Generated');
        const emailBody = encodeURIComponent(`Dear Inventory Manager,\n\nThe inventory report has been generated.\n\nBest regards,\nYour Company`);
        const emailRecipient = encodeURIComponent('inventorymanager@gmail.com');
        const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
        
        window.location.href = mailtoLink;
    };

    return (
        <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-800 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 ">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0" onClick={generatePDF} >
        Generate Report
        </span>
        </button>
    );
};

export default InventoryReport;
