/**
 * Get element by ID with optional error handling
 */
export function getElement(id: string): HTMLElement | null {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
  }
  return element;
}

/**
 * Query selector with optional error handling
 */
export function querySelector(selector: string): Element | null {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
  }
  return element;
}

/**
 * Clear table body contents
 */
export function clearTableBody(tableId: string): void {
  const tbody = querySelector(`#${tableId} tbody`) as HTMLTableSectionElement;
  if (tbody) {
    tbody.innerHTML = "";
  }
}

/**
 * Create and populate a table row with data
 */
export function createTableRow(data: any): HTMLTableRowElement {
  const row = document.createElement("tr");

  // Handle different data formats
  if (Array.isArray(data)) {
    // Array of cell values
    data.forEach((cellData: any) => {
      const cell = document.createElement("td");
      cell.textContent = cellData;
      row.appendChild(cell);
    });
  } else if (typeof data === "object") {
    // Object with cell data
    Object.values(data).forEach((cellData: any) => {
      const cell = document.createElement("td");
      cell.textContent = cellData;
      row.appendChild(cell);
    });
  }

  return row;
}

/**
 * Populate table with data rows
 */
export function populateTable(tableId: string, rowsData: any[], rowProcessor?: (data: any) => HTMLTableRowElement): void {
  const tbody = querySelector(`#${tableId} tbody`) as HTMLTableSectionElement;
  if (!tbody) return;

  clearTableBody(tableId);

  rowsData.forEach((rowData: any) => {
    const row = rowProcessor ? rowProcessor(rowData) : createTableRow(rowData);
    tbody.appendChild(row);
  });
}

/**
 * Set form field values
 */
export function setFormValue(formId: string, fieldName: string, value: string): void {
  const form = getElement(formId) as HTMLFormElement;
  if (form && form[fieldName]) {
    (form[fieldName] as HTMLInputElement).value = value;
  }
}

/**
 * Get form field value
 */
export function getFormValue(formId: string, fieldName: string): string {
  const form = getElement(formId) as HTMLFormElement;
  return form && form[fieldName] ? (form[fieldName] as HTMLInputElement).value : "";
}

/**
 * Set multiple form values at once
 */
export function setFormValues(formId: string, values: Record<string, string>): void {
  Object.entries(values).forEach(([fieldName, value]) => {
    setFormValue(formId, fieldName, value);
  });
}

/**
 * Get all form values as object
 */
export function getFormValues(formId: string): Record<string, string> {
  const form = getElement(formId) as HTMLFormElement;
  if (!form) return {};

  const data: Record<string, string> = {};
  const elements = form.querySelectorAll("input, select, textarea");

  elements.forEach((element) => {
    const inputElement = element as HTMLInputElement;
    if (inputElement.name) {
      if (inputElement.type === "checkbox") {
        data[inputElement.name] = inputElement.checked.toString();
      } else {
        data[inputElement.name] = inputElement.value;
      }
    }
  });

  return data;
}

/**
 * Show/hide element
 */
export function showElement(elementId: string, show: boolean = true): void {
  const element = getElement(elementId);
  if (element) {
    element.style.display = show ? "" : "none";
  }
}

/**
 * Enable/disable element
 */
export function enableElement(elementId: string, enabled: boolean = true): void {
  const element = getElement(elementId) as HTMLInputElement;
  if (element) {
    element.disabled = !enabled;
  }
}

/**
 * Add CSS class to element
 */
export function addClass(elementId: string, className: string): void {
  const element = getElement(elementId);
  if (element) {
    element.classList.add(className);
  }
}

/**
 * Remove CSS class from element
 */
export function removeClass(elementId: string, className: string): void {
  const element = getElement(elementId);
  if (element) {
    element.classList.remove(className);
  }
}

/**
 * Set element text content
 */
export function setText(elementId: string, text: string): void {
  const element = getElement(elementId);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Get element text content
 */
export function getText(elementId: string): string {
  const element = getElement(elementId);
  return element ? element.textContent || "" : "";
}
