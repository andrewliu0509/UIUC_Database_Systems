  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  }

  function roundtoNDecimals(num, n) {
    const floatNum = Number.parseFloat(num);
    if (isNaN(floatNum)) {
      return num;
    }

    return floatNum.toFixed(n);
  }

  function formatLargeNumber(num) {
  if (num === null || num === undefined) return '';
  if (Math.abs(num) < 1000) return num.toString();

  const units = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' }
  ];

  for (let i = 0; i < units.length; i++) {
    if (Math.abs(num) >= units[i].value) {
      let formatted = (num / units[i].value).toFixed(2); // max 2 decimals
      // Remove unnecessary trailing zeros
      formatted = parseFloat(formatted).toString();
      return formatted + units[i].symbol;
    }
  }
}

export default function HouseTable({ houses }) {
    return (
      houses.length === 0 ? <p>No houses found.</p> :
        <>
      
      {/* <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto", border: "2px solid white" }}> */}
      <div
          style={{
            width: "90%",
            margin: "40px auto 0",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "15px",
            // border: "2px solid #555",
          }}
        >
        {/* <h2 style={{color: "#493f3cff"}}>House Data</h2> */}

        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Property Type</th>
              <th>Region</th>
              <th>Period Begin</th>
              <th>Period End</th>
              <th>Median Sale Price</th>
              <th>Median List Price</th>
              <th>Median PPSF</th>
              <th>Median List PPSF</th>
              <th>Homes Sold</th>
              <th>Sold above List</th>
              <th>Pending Sales</th>
              <th>New Listings</th>
              <th>Inventory</th>
              <th>Months of Supply</th>
              <th>Median DOM</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house, idx) => (
              <tr key={`house-table-${idx}`}>
                <td>{house.property_type}</td>
                <td>{house.region}</td>
                <td>{formatDate(house.period_begin)}</td>
                <td>{formatDate(house.period_end)}</td>
                <td>{formatLargeNumber(house.median_sale_price)}</td>
                <td>{formatLargeNumber(house.median_list_price)}</td>
                <td>{roundtoNDecimals(house.median_ppsf, 1)}</td>
                <td>{roundtoNDecimals(house.median_list_ppsf, 1)}</td>
                <td>{house.homes_sold}</td>
                <td>{roundtoNDecimals(house.sold_above_list, 3)}</td>
                <td>{house.pending_sales}</td>
                <td>{house.new_listings}</td>
                <td>{house.inventory}</td>
                <td>{house.months_of_supply}</td>
                <td>{house.median_dom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
    )
}