export const variantPairs={'41:61':'41:62','41:62':'41:61','41:76':'41:77','41:77':'41:76'};
export function nextVariant(current){return variantPairs[current]??current;}
