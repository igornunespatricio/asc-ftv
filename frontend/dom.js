// dom.js - Shared DOM manipulation utilities
// Provides common DOM operations used across the application

/**
 * Get element by ID with optional error handling
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
  }
  return element;
}

/**
 * Query selector with optional error handling
 */
export function querySelector(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
  }
  return element;
}

/**
 * Clear table body contents
 */
export function clearTableBody(tableId) {
  const tbody = querySelector(`#${tableId} tbody`);
  if (tbody) {
    tbody.innerHTML = "";
  }
}

/**
 * Create and populate a table row with data
 */
export function createTableRow(data) {
  const row = document.createElement("tr");

  // Handle different data formats
  if (Array.isArray(data)) {
    // Array of cell values
    data.forEach((cellData) => {
      const cell = document.createElement("td");
      cell.textContent = cellData;
      row.appendChild(cell);
    });
  } else if (typeof data === "object") {
    // Object with cell data
    Object.values(data).forEach((cellData) => {
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
export function populateTable(tableId, rowsData, rowProcessor = null) {
  const tbody = querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  clearTableBody(tableId);

  rowsData.forEach((rowData) => {
    const row = rowProcessor ? rowProcessor(rowData) : createTableRow(rowData);
    tbody.appendChild(row);
  });
}

/**
 * Set form field values
 */
export function setFormValue(formId, fieldName, value) {
  const form = getElement(formId);
  if (form && form[fieldName]) {
    form[fieldName].value = value;
  }
}

/**
 * Get form field value
 */
export function getFormValue(formId, fieldName) {
  const form = getElement(formId);
  return form && form[fieldName] ? form[fieldName].value : "";
}

/**
 * Set multiple form values at once
 */
export function setFormValues(formId, values) {
  Object.entries(values).forEach(([fieldName, value]) => {
    setFormValue(formId, fieldName, value);
  });
}

/**
 * Get all form values as object
 */
export function getFormValues(formId) {
  const form = getElement(formId);
  if (!form) return {};

  const data = {};
  const elements = form.querySelectorAll("input, select, textarea");

  elements.forEach((element) => {
    if (element.name) {
      if (element.type === "checkbox") {
        data[element.name] = element.checked;
      } else {
        data[element.name] = element.value;
      }
    }
  });

  return data;
}

/**
 * Show/hide element
 */
export function showElement(elementId, show = true) {
  const element = getElement(elementId);
  if (element) {
    element.style.display = show ? "" : "none";
  }
}

/**
 * Enable/disable element
 */
export function enableElement(elementId, enabled = true) {
  const element = getElement(elementId);
  if (element) {
    element.disabled = !enabled;
  }
}

/**
 * Add CSS class to element
 */
export function addClass(elementId, className) {
  const element = getElement(elementId);
  if (element) {
    element.classList.add(className);
  }
}

/**
 * Remove CSS class from element
 */
export function removeClass(elementId, className) {
  const element = getElement(elementId);
  if (element) {
    element.classList.remove(className);
  }
}

/**
 * Set element text content
 */
export function setText(elementId, text) {
  const element = getElement(elementId);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Get element text content
 */
export function getText(elementId) {
  const element = getElement(elementId);
  return element ? element.textContent : "";
}
