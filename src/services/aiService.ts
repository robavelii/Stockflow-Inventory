import { Product } from '@/types';

/**
 * Mock AI Service - Simulates AI-powered inventory analysis
 * This replaces the Gemini API for demo purposes
 */
export const generateEfficiencyReport = async (products: Product[]): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  // Group by category for summary
  const categorySummary = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryNames = Object.keys(categorySummary);
  const topCategory = categoryNames.reduce(
    (a, b) => (categorySummary[a] > categorySummary[b] ? a : b),
    categoryNames[0]
  );
  const bottomCategory = categoryNames.reduce(
    (a, b) => (categorySummary[a] < categorySummary[b] ? a : b),
    categoryNames[0]
  );

  const avgPrice =
    products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;

  // Generate mock AI report
  const report = `# Inventory Optimization Report

## Executive Summary

Your inventory currently contains **${products.length} products** with a total value of **$${totalInventoryValue.toLocaleString()}**. 

**Stock Health Status:** ${lowStockCount + outOfStockCount === 0 ? '✅ Excellent' : lowStockCount + outOfStockCount < 5 ? '⚠️ Good' : '🔴 Needs Attention'}

- **Low Stock Items:** ${lowStockCount}
- **Out of Stock Items:** ${outOfStockCount}
- **Healthy Stock:** ${products.length - lowStockCount - outOfStockCount}

## Stock Health Analysis

${
  lowStockCount + outOfStockCount > 0
    ? `
### Critical Alerts

${lowStockCount > 0 ? `- **${lowStockCount} items** are running low and require immediate restocking to prevent stockouts.` : ''}
${outOfStockCount > 0 ? `- **${outOfStockCount} items** are currently out of stock, impacting potential sales.` : ''}

**Recommendation:** Prioritize restocking these items to maintain service levels and customer satisfaction.
`
    : `
### ✅ All Stock Levels Healthy

Congratulations! All inventory items are above minimum threshold levels. Continue monitoring to maintain this status.
`
}

## Category Insights

### Distribution Analysis

${
  categoryNames.length > 0
    ? `
- **${topCategory}** has the highest inventory quantity (${categorySummary[topCategory]} units)
- **${bottomCategory}** has the lowest inventory quantity (${categorySummary[bottomCategory]} units)
`
    : 'No category data available.'
}

### Category Recommendations

${
  categoryNames.length > 0
    ? categoryNames
        .map((cat) => {
          const catProducts = products.filter((p) => p.category === cat);
          const catValue = catProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
          const catLowStock = catProducts.filter(
            (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
          ).length;

          return `- **${cat}**: ${catProducts.length} products, $${catValue.toLocaleString()} value${catLowStock > 0 ? `, ${catLowStock} items need attention` : ''}`;
        })
        .join('\n')
    : 'No categories to analyze.'
}

## Actionable Recommendations

### 1. Immediate Actions
${outOfStockCount > 0 ? `- **Restock ${outOfStockCount} out-of-stock items** immediately to prevent lost sales opportunities.` : '- No immediate restocking required.'}
${lowStockCount > 0 ? `- **Replenish ${lowStockCount} low-stock items** before they run out completely.` : ''}

### 2. Inventory Optimization
- **Average Product Price:** $${avgPrice.toFixed(2)}
- Consider implementing **automated reorder points** based on historical sales data
- Review **slow-moving inventory** (items with high quantity but low turnover)

### 3. Strategic Improvements
- **Diversify inventory** across categories to reduce risk
- **Monitor top-performing categories** (${topCategory}) for expansion opportunities
- **Review pricing strategy** for items with high inventory value but low turnover

---

*Report generated using AI-powered analysis. This is a simulated report for demonstration purposes.*
*Last updated: ${new Date().toLocaleDateString()}*
`;

  return report;
};
