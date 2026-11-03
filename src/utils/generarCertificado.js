import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generarCertificadoPdf = async (obra) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape", // Formato horizontal tipo diploma
      unit: "mm",
      format: "a4"
    });

    // 1. Fondo y Marco decorativo del diploma
    doc.setLineWidth(1.5);
    doc.setDrawColor(27, 77, 62); // Color verde institucional (#1b4d3e)
    doc.rect(10, 10, 277, 190);

    doc.setLineWidth(0.5);
    doc.rect(13, 13, 271, 184);

    // 2. Encabezado / Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(27, 77, 62);
    doc.text("CERTIFICADO DE REGISTRO DE AUTORÍA", 148.5, 35, { align: "center" });

    // 3. Subtítulo / Descripción
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("El presente documento certifica el registro oficial de la obra en la plataforma REGISTRA-IP", 148.5, 45, { align: "center" });

    // 4. Nombre de la Obra (Jerarquía alta)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`"${obra.titulo || 'Título de la Obra'}"`, 148.5, 70, { align: "center" });

    // 5. Metadatos (Categoría, Descripción, Autor)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    doc.text(`Categoría: ${obra.categoria || 'N/D'}`, 40, 95);
    doc.text(`Descripción: ${obra.descripcion || 'Sin descripción'}`, 40, 105, { maxWidth: 210 });
    doc.text(`Autor: ${obra.autor || 'Xavier Uriel Reyes Vilchis'}`, 40, 125);
    
    // Leyenda obligatoria personalizada
    doc.setFont("helvetica", "bold");
    doc.text("Registrado por: Xavier Uriel Reyes Vilchis", 40, 135);
    doc.text(`Folio Oficial: ${obra.folio || 'OBRA-0810-001'}`, 40, 145);

    // 6. Generación del Código QR a partir del folio
    const qrDataUrl = await QRCode.toDataURL(obra.folio || 'OBRA-0810-001', { width: 300, margin: 1 });
    
    // Insertar imagen del QR en el PDF
    doc.addImage(qrDataUrl, 'PNG', 215, 115, 45, 45);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Escanea el QR para verificar el folio", 237, 165, { align: "center" });

    // 7. Pie de página / Fecha
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 40, 175);

    // Guardar el archivo PDF resultante
    doc.save(`certificado-${obra.folio || 'obra'}.pdf`);
  } catch (error) {
    console.error("Error al generar el certificado PDF:", error);
    alert("Hubo un error al generar el certificado.");
  }
};