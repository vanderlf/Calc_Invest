const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(columnsArray) &&
    !isNonEmptyArray(dataArray) &&
    !tableId
  ) {
    throw new Error(
      'Precisamos de um array de colunas, outro com informações das linhas e o Id do elemento Tabela. '
    );
  }

  const tableElement = document.getElementById(tableId);
  if (!tableElement || tableElement.nodeName !== 'TABLE') {
    throw new Error('O Id informação não pertence a um element TABLE.');
  }
  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
  /*
        <table> </table>
        <table>
            <theard> </theard>
            <tbody> </tbody>
        </table>
    */
  function createTheadElement(tableReference) {
    const thead = document.createElement('thead'); //<thead></thead>
    tableReference.appendChild(thead); //<table><thead></thead></table>
    return thead;
  }
  const tableHeaderReference =
    tableReference.querySelector('thead') ?? createTheadElement(tableReference); //<table><thead></thead></table>
  const headerRow = document.createElement('tr'); // <tr></tr>
  ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) =>
    headerRow.classList.add(cssClass)
  );
  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class='text-center'>${tableColumnObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement;
  } //<tr><th class = 'text-center'>Nome da coluna</th></tr>
  tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
  function createTBodyElement(tableReference) {
    const tbody = document.createElement('tbody');
    tableReference.appendChild(tbody);
    return tbody;
  }

  const tableBodyReference =
    tableReference.querySelector('tbody') ?? createTBodyElement(tableReference);
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement('tr');
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add('bg-blue-200');
    }
    for (const tableColumn of columnsArray) {
      tableRow.innerHTML += /*html*/ `<td class ='text-center'>${
        tableItem[tableColumn.accessor]
      }</td>`;
    }
    tableBodyReference.appendChild(tableRow);
  }
}
