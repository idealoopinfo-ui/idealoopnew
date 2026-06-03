export const exportCSV = (data, filename = "users.csv") => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
  
    const headers = Object.keys(data[0]).join(",");
  
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value ?? ""}"`)
        .join(",")
    );
  
    const csvContent = [headers, ...rows].join("\n");
  
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
  
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    window.URL.revokeObjectURL(url);
  };