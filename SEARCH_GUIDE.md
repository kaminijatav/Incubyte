# 🔍 Search Bar Guide - What Can You Search?

The search bar in the Sweet Shop Management System allows you to filter and find sweets using multiple criteria. Here's what you can search for:

## 📋 Search Options

### 1. **Search by Name** 📝
- **Field**: Name input box
- **What to enter**: Any part of the sweet's name
- **How it works**: Case-insensitive partial matching
- **Examples**:
  - Search `"chocolate"` → Finds: "Chocolate Bar", "Dark Chocolate", "Chocolate Cake"
  - Search `"bar"` → Finds: "Chocolate Bar", "Candy Bar"
  - Search `"ice"` → Finds: "Ice Cream", "Ice Cream Sandwich"

**Tip**: You don't need to type the full name - partial matches work!

---

### 2. **Filter by Category** 🏷️
- **Field**: Category dropdown
- **Options Available**:
  - **Chocolate** - All chocolate items
  - **Candy** - All candy items
  - **Biscuit** - All biscuits/cookies
  - **Cake** - All cake items
  - **Ice Cream** - All ice cream items
  - **Other** - Items in other categories
  - **All Categories** - Shows everything (default)

**Example**: Select "Chocolate" to see only chocolate items

---

### 3. **Filter by Price Range** 💰
- **Fields**: Min Price and Max Price
- **What to enter**: Decimal numbers (e.g., 2.50, 10.00)
- **How it works**: Finds sweets within the price range

**Examples**:
- **Min Price: 1.00, Max Price: 5.00** → Shows sweets priced between $1 and $5
- **Min Price: 10.00** (no max) → Shows sweets $10 and above
- **Max Price: 3.00** (no min) → Shows sweets $3 and below
- **Min Price: 2.50, Max Price: 2.50** → Shows sweets exactly $2.50

---

## 🎯 Search Combinations

You can combine multiple search criteria for more specific results:

### Example 1: Name + Category
- **Name**: "chocolate"
- **Category**: "Chocolate"
- **Result**: Only chocolate items with "chocolate" in the name

### Example 2: Category + Price Range
- **Category**: "Candy"
- **Min Price**: 1.00
- **Max Price**: 3.00
- **Result**: Candy items priced between $1 and $3

### Example 3: All Filters Combined
- **Name**: "bar"
- **Category**: "Chocolate"
- **Min Price**: 2.00
- **Max Price**: 5.00
- **Result**: Chocolate items with "bar" in name, priced between $2-$5

---

## 📖 Step-by-Step Search Examples

### Example 1: Find All Chocolate Items
1. Leave "Name" field empty
2. Select "Chocolate" from Category dropdown
3. Leave price fields empty
4. Click **"Search"**

### Example 2: Find Expensive Sweets
1. Leave "Name" field empty
2. Select "All Categories"
3. Enter **10.00** in Min Price
4. Leave Max Price empty
5. Click **"Search"**

### Example 3: Find Budget-Friendly Candy
1. Leave "Name" field empty
2. Select "Candy" from Category
3. Enter **0.50** in Min Price
4. Enter **2.00** in Max Price
5. Click **"Search"**

### Example 4: Search for Specific Item
1. Type **"lollipop"** in Name field
2. Select "All Categories"
3. Leave price fields empty
4. Click **"Search"**

---

## 🔄 How to Use

1. **Enter search criteria** in any combination of fields
2. **Click "Search"** button to filter results
3. **Click "Clear"** button to reset and show all sweets

---

## 💡 Search Tips

✅ **Partial Matching**: Name search uses partial matching - you don't need the full name
✅ **Case Insensitive**: "CHOCOLATE" and "chocolate" will find the same results
✅ **Combine Filters**: Use multiple filters together for precise results
✅ **Empty Fields**: Leave fields empty if you don't want to filter by that criteria
✅ **Clear Button**: Use "Clear" to reset all filters and see all sweets

---

## ❓ Common Questions

**Q: Can I search by description?**
A: Currently, search only works by name, category, and price. Description search is not available.

**Q: Can I search for out-of-stock items?**
A: The search doesn't filter by stock quantity, but you can see stock levels in the results.

**Q: What if no results are found?**
A: Try removing some filters or checking your spelling. The search is case-insensitive but must match the exact category names.

**Q: Can I save my search?**
A: Currently, searches are not saved. You need to re-enter criteria each time.

---

## 🎯 Quick Reference

| Search Field | Type | Example Values | Case Sensitive? |
|-------------|------|----------------|-----------------|
| Name | Text | "chocolate", "bar", "ice" | No |
| Category | Dropdown | Chocolate, Candy, Biscuit, etc. | Yes (exact match) |
| Min Price | Number | 1.00, 2.50, 10.00 | N/A |
| Max Price | Number | 5.00, 10.00, 100.00 | N/A |

---



