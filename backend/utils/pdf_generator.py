import io
import time
from typing import List, Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_report(project_name: str, findings: List[Dict[str, Any]], risk_score: str, lines_scanned: int, execution_time_ms: int) -> bytes:
    """
    Generates a beautifully styled, professional PDF security scan report using ReportLab.
    Runs completely in memory and returns raw PDF bytes.
    """
    buffer = io.BytesIO()
    
    # 1. Page template Setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Define custom styles with corporate color scheme (Deep Blue, Cyan, Slate Gray)
    primary_color = colors.HexColor("#0F172A") # slate-900
    secondary_color = colors.HexColor("#1E293B") # slate-800
    accent_color = colors.HexColor("#3B82F6") # blue-500
    border_color = colors.HexColor("#E2E8F0") # slate-200
    
    severity_colors = {
        "CRITICAL": colors.HexColor("#EF4444"), # Red-500
        "HIGH": colors.HexColor("#F97316"),     # Orange-500
        "MEDIUM": colors.HexColor("#EAB308"),   # Yellow-500
        "LOW": colors.HexColor("#3B82F6"),      # Blue-500
        "N/A": colors.HexColor("#64748B")       # Slate-500
    }

    # Custom typography style sheets
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=primary_color,
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=24
    )
    
    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=colors.HexColor("#334155"),
        leading=14,
        spaceAfter=8
    )
    
    meta_label_style = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor("#475569")
    )
    
    meta_val_style = ParagraphStyle(
        'MetaValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#0F172A")
    )
    
    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        textColor=colors.HexColor("#0F172A"),
        leading=11,
        spaceBefore=4,
        spaceAfter=4
    )

    story = []
    
    # ==========================================
    # TITLE SECTION
    # ==========================================
    story.append(Paragraph("SecureLens Security Audit Report", title_style))
    date_str = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    story.append(Paragraph(f"Generated on {date_str} | Powered by SecureLens Engine & Gemini Cascade RAG", subtitle_style))
    story.append(Spacer(1, 10))
    
    # ==========================================
    # EXECUTIVE SUMMARY & METRICS SECTION
    # ==========================================
    story.append(Paragraph("Executive Summary & Project Statistics", h2_style))
    
    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for f in findings:
        sev = f.get("severity", "LOW").upper()
        if sev in severity_counts:
            severity_counts[sev] += 1
            
    summary_data = [
        [Paragraph("Project Target", meta_label_style), Paragraph(project_name, meta_val_style),
         Paragraph("Overall Risk Score", meta_label_style), Paragraph(risk_score, ParagraphStyle('RS', parent=meta_val_style, fontName='Helvetica-Bold', textColor=severity_colors.get(risk_score, primary_color)))],
        [Paragraph("Files Scanned", meta_label_style), Paragraph(str(len(set(f.get("file_path", "app.py") for f in findings)) or 1), meta_val_style),
         Paragraph("Critical Findings", meta_label_style), Paragraph(str(severity_counts["CRITICAL"]), meta_val_style)],
        [Paragraph("Lines Scanned", meta_label_style), Paragraph(str(lines_scanned), meta_val_style),
         Paragraph("High Findings", meta_label_style), Paragraph(str(severity_counts["HIGH"]), meta_val_style)],
        [Paragraph("Analysis Duration", meta_label_style), Paragraph(f"{execution_time_ms} ms", meta_val_style),
         Paragraph("Medium/Low Findings", meta_label_style), Paragraph(str(severity_counts["MEDIUM"] + severity_counts["LOW"]), meta_val_style)]
    ]
    
    metrics_table = Table(summary_data, colWidths=[120, 140, 130, 130])
    metrics_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8FAFC")),
        ('BACKGROUND', (2,0), (2,-1), colors.HexColor("#F8FAFC")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(metrics_table)
    story.append(Spacer(1, 20))
    
    # ==========================================
    # FINDINGS TABLE OVERVIEW
    # ==========================================
    story.append(Paragraph("Vulnerabilities Overview Table", h2_style))
    
    if not findings:
        story.append(Paragraph("No vulnerabilities detected in this scan. Code aligns with security best practices.", body_style))
    else:
        table_headers = [
            Paragraph("<b>File / Line</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white)),
            Paragraph("<b>Severity</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white)),
            Paragraph("<b>Vulnerability</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white)),
            Paragraph("<b>Standard</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white))
        ]
        
        table_rows = [table_headers]
        for f in findings:
            loc = f"{f.get('file_path', 'source.py')}:{f.get('line', 1)}"
            sev = f.get('severity', 'LOW')
            vuln_type = f.get('type', 'vulnerability').replace('_', ' ').title()
            std = f"{f.get('cwe_id', 'CWE')} | {f.get('owasp_id', 'OWASP')}"
            
            # Format location paragraph to handle long path wrapping
            loc_p = Paragraph(loc, ParagraphStyle('LocWrap', parent=body_style, fontSize=8))
            sev_p = Paragraph(f"<b>{sev}</b>", ParagraphStyle('SevColor', parent=body_style, fontName='Helvetica-Bold', textColor=severity_colors.get(sev, primary_color)))
            vuln_p = Paragraph(vuln_type, body_style)
            std_p = Paragraph(std, body_style)
            
            table_rows.append([loc_p, sev_p, vuln_p, std_p])
            
        findings_table = Table(table_rows, colWidths=[150, 80, 160, 130])
        findings_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), secondary_color),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('TOPPADDING', (0,0), (-1,0), 6),
            ('GRID', (0,0), (-1,-1), 0.5, border_color),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
            ('PADDING', (0,1), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(findings_table)
        
    story.append(Spacer(1, 20))
    story.append(PageBreak())
    
    # ==========================================
    # DETAILED FINDINGS SECTION
    # ==========================================
    story.append(Paragraph("Detailed Security Findings & Remediation Guidance", h2_style))
    
    for idx, f in enumerate(findings, 1):
        finding_elements = []
        loc = f"{f.get('file_path', 'source.py')}:{f.get('line', 1)}"
        sev = f.get('severity', 'LOW')
        vuln_type = f.get('type', 'vulnerability').replace('_', ' ').title()
        
        # Heading for individual finding
        finding_elements.append(Paragraph(f"<b>Finding {idx}: {vuln_type}</b>", ParagraphStyle('FTitle', parent=h2_style, fontSize=12, spaceBefore=8, spaceAfter=4)))
        finding_elements.append(Paragraph(f"<b>Location</b>: {loc} | <b>Severity</b>: <font color='{severity_colors.get(sev, primary_color).hexval()}'><b>{sev}</b></font> | <b>Classification</b>: {f.get('cwe_id', 'CWE')} ({f.get('owasp_id', 'OWASP')})", ParagraphStyle('FSub', parent=subtitle_style, spaceAfter=8)))
        
        # Explanation block
        finding_elements.append(Paragraph("<b>Description & Vulnerability Analysis:</b>", ParagraphStyle('DLabel', parent=body_style, fontName='Helvetica-Bold', spaceBefore=4)))
        finding_elements.append(Paragraph(f.get("explanation", "No analysis provided."), body_style))
        
        # Attack Scenario block
        finding_elements.append(Paragraph("<b>Attack Vector Scenario:</b>", ParagraphStyle('ALabel', parent=body_style, fontName='Helvetica-Bold', spaceBefore=4)))
        finding_elements.append(Paragraph(f.get("attack_scenario", "No exploitation details available."), body_style))
        
        # Code comparison blocks (Vulnerable Code & Fix Code)
        vuln_code = f.get("snippet", "").strip()
        fix_code = f.get("fix_snippet", "").strip()
        
        comparison_data = [
            [Paragraph("<b>Vulnerable Code Snippet</b>", ParagraphStyle('CSL', parent=body_style, textColor=colors.HexColor("#EF4444"))), 
             Paragraph("<b>Recommended Secure Fix</b>", ParagraphStyle('CSL', parent=body_style, textColor=colors.HexColor("#10B981")))],
            [Paragraph(vuln_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style), 
             Paragraph(fix_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style)]
        ]
        
        comp_table = Table(comparison_data, colWidths=[255, 255])
        comp_table.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 0.5, border_color),
            ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ('BACKGROUND', (0,0), (0,0), colors.HexColor("#FEF2F2")),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor("#ECFDF5")),
            ('BACKGROUND', (0,1), (0,1), colors.HexColor("#FFFDFD")),
            ('BACKGROUND', (1,1), (1,1), colors.HexColor("#FAFFFC")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        
        finding_elements.append(comp_table)
        finding_elements.append(Spacer(1, 10))
        
        # Reference source
        finding_elements.append(Paragraph(f"<b>Citations & References</b>: {f.get('source_citation', 'OWASP Security Guide')}", ParagraphStyle('FCite', parent=subtitle_style, fontSize=7.5, spaceAfter=8)))
        finding_elements.append(Spacer(1, 12))
        
        # Keep each finding block together on a single page if possible
        story.append(KeepTogether(finding_elements))
        
    # 3. Build document
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
