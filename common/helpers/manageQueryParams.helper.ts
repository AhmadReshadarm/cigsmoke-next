import { convertQueryParams } from 'components/store/catalog/helpers';

const pushQueryParams = (data: { name: string; value: any }[]) => {
  const url = new URL(window.location as any);
  data.forEach(({ name, value }) => {
    if (!value) {
      url.searchParams.delete(name);
    } else if (Array.isArray(value)) {
      url.searchParams.delete(name);
      value.forEach((value) => {
        url.searchParams.append(name, value);
      });
    } else {
      url.searchParams.set(name, value);
    }
  });
  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('locationChange'));
};

const pushDynamicQueryParams = (
  data: { name: string; value: any; checked: boolean }[],
) => {
  const url = new URL(window.location as any);

  data.forEach(({ name, value, checked }) => {
    const existingParams = url.searchParams.getAll(name);
    console.log(url.searchParams);

    if (Array.isArray(value) && checked) {
      // Handling Array (Multi-Select) Parameters
      // const existingParams = url.searchParams.getAll(name); // 1. Get all existing values
      const combinedValues = [...new Set([...existingParams, ...value])]; // 3. Union of existing and new, remove duplicates

      url.searchParams.delete(name); // 4. Clear all existing parameters
      combinedValues.forEach((val) => {
        // 5. Append the combined, unique values
        if (val !== null && val !== undefined && val !== '') {
          url.searchParams.append(name, val);
        }
      });
    } else if (!value && !checked) {
      // // Handling Single Values
      // url.searchParams.set(name, value); // For single values, just set (replace)
      url.searchParams.delete(name);
    } else {
      // url.searchParams.delete(name); // Remove parameter if value is null/undefined/empty
      url.searchParams.set(name, value);
    }
  });

  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('locationChange'));
};

// test this method then use it 👇

// const pushDynamicQueryParams = (
//   data: { name: string; value: any }[], // Removed 'checked' parameter from data
// ) => {
//   const url = new URL(window.location as any);

//   data.forEach(({ name, value }) => {
//     if (Array.isArray(value)) {
//       // Handling Array (Multi-Select) Parameters
//       url.searchParams.delete(name); // Clear existing parameters first
//       value.forEach((val) => {
//         // Then append all *current* values
//         if (val !== null && val !== undefined && val !== '') {
//           url.searchParams.append(name, val);
//         }
//       });
//     } else if (value === null || value === undefined || value === '') {
//       // Corrected removal condition
//       url.searchParams.delete(name); // Remove parameter if value is null/undefined/empty
//     } else {
//       url.searchParams.set(name, value); // For single values, just set
//     }
//   });

//   window.history.pushState({}, '', url);
//   window.dispatchEvent(new Event('locationChange'));
// };

const clearQueryParams = () => {
  window.history.pushState({}, '', window.location.pathname);
  window.dispatchEvent(new Event('locationChange'));
};

const getQueryParams = (
  searchString: string,
): {
  [k: string]: string;
} => {
  const urlSearchParams = new URLSearchParams(decodeURI(searchString));
  const entries = urlSearchParams.entries();
  const result = {};

  for (let entry of entries as any) {
    // each 'entry' is a [key, value]
    const key = entry[0];
    const val = entry[1];
    if (key in result) {
      result[key].push(val);
    } else {
      result[key] = [val];
    }
  }

  return result;
};

export {
  pushQueryParams,
  getQueryParams,
  clearQueryParams,
  pushDynamicQueryParams,
};
