export function groupMultiAccordions(blocks) {
  const output = [];
  let currentAccordions = [];
  for (const block of blocks) {
    if (block._type === 'accordionTitle') {
      const newAccordion = {
        _type: 'accordion',
        title: block.title,
        content: [],
        first: currentAccordions.length === 0,
        last: false,
      };
      currentAccordions.push(newAccordion);
    } else if (block._type === 'accordionEnd') {
      if (currentAccordions.length > 0) {
        currentAccordions[currentAccordions.length - 1].last = true;
      }
      output.push(...currentAccordions);
      currentAccordions = [];
    } else if (currentAccordions.length > 0) {
      currentAccordions[currentAccordions.length - 1].content.push(block);
    } else {
      output.push(block);
    }
  }
  if (currentAccordions.length > 0) {
    currentAccordions[currentAccordions.length - 1].last = true;
    output.push(...currentAccordions);
  }

  return output;
}