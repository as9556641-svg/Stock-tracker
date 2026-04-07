function ExportButtons({ onExportCsv, onExportPdf }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="btn-secondary" onClick={onExportCsv} type="button">
        Export CSV
      </button>
      <button className="btn-secondary" onClick={onExportPdf} type="button">
        Export PDF
      </button>
    </div>
  );
}

export default ExportButtons;
