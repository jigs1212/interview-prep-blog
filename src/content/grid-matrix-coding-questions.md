---
slug: "grid-matrix-coding-questions"
title: "Grid and Matrix Coding Questions for Interviews"
description: "Grid and matrix coding questions for interviews — multiplication table, spiral traversal, rotation, transpose, and set zeroes."
category: "Coding Questions"
subcategory: "Matrix & Grid"
tags: ["matrix", "grid", "coding-questions", "algorithms", "typescript"]
date: "2026-03-25"
related: ["javascript-interview-questions", "typescript-generics-masterclass", "frontend-system-design-questions"]
---

## Introduction

Matrix and grid problems are a staple of technical interviews. They test your ability to work with two-dimensional data structures, manage indices without off-by-one errors, and reason about in-place mutations. These questions come up across all levels, but senior candidates are expected to discuss space optimization, edge cases, and follow-up variations without prompting.

For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

This guide covers five common matrix problems, starting with a detailed walkthrough of the multiplication table problem and progressing through spiral traversal, rotation, transposition, and zeroing. Each solution is in TypeScript with time and space complexity analysis.

## Multiplication Table

This is a formatting-heavy problem that tests string manipulation alongside basic nested loops. Given an integer `n`, print a multiplication table as a formatted grid where the first row and first column are headers (1 through n), the top-left cell is `X`, and each inner cell contains the product of its row and column headers. Numbers must be right-aligned for clean output.

Expected output for `n = 4`:

```
X  |  1  |  2  |  3  |  4
---+-----+-----+-----+----
1  |  1  |  2  |  3  |  4
2  |  2  |  4  |  6  |  8
3  |  3  |  6  |  9  | 12
4  |  4  |  8  | 12  | 16
```

### Basic Nested Loop Approach

The straightforward approach uses two nested loops. The outer loop iterates rows (0 through n, where 0 is the header row), and the inner loop iterates columns. The key challenge is formatting each cell to a consistent width.

This function builds the multiplication table row by row, using `String.padStart` for right-alignment.

```typescript
function printMultiplicationTable(n: number): void {
	if (n <= 0) {
		console.log('Input must be a positive integer')
		return
	}

	const maxProduct = n * n
	const cellWidth = String(maxProduct).length + 1

	const formatCell = (value: string): string => {
		return value.padStart(cellWidth)
	}

	// Header row
	const headerCells = ['X']
	for (let col = 1; col <= n; col++) {
		headerCells.push(formatCell(String(col)))
	}
	console.log(headerCells.join('  | '))

	// Separator
	const separatorParts = ['-'.repeat(cellWidth)]
	for (let col = 1; col <= n; col++) {
		separatorParts.push('-'.repeat(cellWidth + 2))
	}
	console.log(separatorParts.join('+'))

	// Data rows
	for (let row = 1; row <= n; row++) {
		const rowCells = [formatCell(String(row))]
		for (let col = 1; col <= n; col++) {
			rowCells.push(formatCell(String(row * col)))
		}
		console.log(rowCells.join('  | '))
	}
}
```

**Time complexity:** O(n^2) — you must compute and print n * n products.

**Space complexity:** O(n) — each row is built as a string of n cells. Only one row is held in memory at a time.

### String Padding for Alignment

The critical detail interviewers look for is how you determine cell width. The largest number in the table is `n * n`. Using `String(n * n).length` as the minimum width ensures every cell aligns correctly regardless of digit count. `padStart` is the cleanest way to right-align in JavaScript/TypeScript.

This helper demonstrates isolated cell formatting logic.

```typescript
function formatCell(value: number | string, width: number): string {
	return String(value).padStart(width)
}

// For n = 12, maxProduct = 144, cellWidth = 3
// formatCell(6, 3)   => '  6'
// formatCell(144, 3) => '144'
```

### Edge Cases

Three edge cases matter here. When `n = 0` or negative, the function should bail out with a message or return an empty string. When `n = 1`, the table is a 2x2 grid with just `X | 1` and `1 | 1`. For large `n` (say 100), the cell width grows to 5 characters (since 100 * 100 = 10000), and the output becomes very wide. An interviewer might ask you to handle this with horizontal scrolling or truncation.

This shows how the function handles the n=1 case cleanly.

```typescript
printMultiplicationTable(1)
// Output:
// X  |  1
// ---+----
// 1  |  1
```

### Follow-Up: Upper and Lower Triangle

A common follow-up asks you to print only the upper triangle (where column >= row) or lower triangle (where column <= row). The modification is minimal — add a conditional inside the inner loop.

This version prints only the upper triangle, replacing below-diagonal cells with empty padding.

```typescript
function printUpperTriangle(n: number): void {
	const maxProduct = n * n
	const cellWidth = String(maxProduct).length + 1

	const formatCell = (value: string): string => {
		return value.padStart(cellWidth)
	}

	const emptyCell = ' '.repeat(cellWidth)

	const headerCells = ['X']
	for (let col = 1; col <= n; col++) {
		headerCells.push(formatCell(String(col)))
	}
	console.log(headerCells.join('  | '))

	for (let row = 1; row <= n; row++) {
		const rowCells = [formatCell(String(row))]
		for (let col = 1; col <= n; col++) {
			if (col >= row) {
				rowCells.push(formatCell(String(row * col)))
			} else {
				rowCells.push(emptyCell)
			}
		}
		console.log(rowCells.join('  | '))
	}
}
```

**Time complexity:** O(n^2) — still iterates all cells even though some are empty.

**Space complexity:** O(n) — same as the full table.

## Spiral Matrix Traversal

Given an `m x n` 2D matrix, return all elements in spiral order — starting from the top-left, moving right, then down, then left, then up, and repeating inward.

### Boundary Pointer Approach

The standard approach uses four boundary pointers: `top`, `bottom`, `left`, and `right`. After traversing one edge of the spiral, you shrink the corresponding boundary inward. The loop continues until the boundaries cross.

This function collects matrix elements in clockwise spiral order using four shrinking boundaries.

```typescript
function spiralOrder(matrix: number[][]): number[] {
	if (matrix.length === 0) return []

	const result: number[] = []
	let top = 0
	let bottom = matrix.length - 1
	let left = 0
	let right = matrix[0].length - 1

	while (top <= bottom && left <= right) {
		// Traverse right across top row
		for (let col = left; col <= right; col++) {
			result.push(matrix[top][col])
		}
		top++

		// Traverse down right column
		for (let row = top; row <= bottom; row++) {
			result.push(matrix[row][right])
		}
		right--

		// Traverse left across bottom row
		if (top <= bottom) {
			for (let col = right; col >= left; col--) {
				result.push(matrix[bottom][col])
			}
			bottom--
		}

		// Traverse up left column
		if (left <= right) {
			for (let row = bottom; row >= top; row--) {
				result.push(matrix[row][left])
			}
			left++
		}
	}

	return result
}
```

**Time complexity:** O(m * n) — every element is visited exactly once.

**Space complexity:** O(1) — excluding the output array, only four pointer variables are used.

### Edge Cases

A single-row matrix like `[[1, 2, 3]]` only triggers the rightward traversal. A single-column matrix like `[[1], [2], [3]]` triggers rightward (one element) then downward. A 1x1 matrix returns a single element. The boundary checks `if (top <= bottom)` and `if (left <= right)` inside the loop are essential — without them, elements get double-counted in non-square matrices.

## Rotate Matrix 90 Degrees Clockwise

Given an `n x n` square matrix, rotate it 90 degrees clockwise in-place. This means element at position `(i, j)` moves to `(j, n - 1 - i)`.

### Transpose and Reverse Rows

The elegant two-step approach: first transpose the matrix (swap rows and columns), then reverse each row. This achieves the same result as a direct rotation but is much easier to code correctly.

This function rotates an n x n matrix in-place by transposing then reversing each row.

```typescript
function rotate(matrix: number[][]): void {
	const n = matrix.length

	// Step 1: Transpose (swap matrix[i][j] with matrix[j][i])
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const temp = matrix[i][j]
			matrix[i][j] = matrix[j][i]
			matrix[j][i] = temp
		}
	}

	// Step 2: Reverse each row
	for (let i = 0; i < n; i++) {
		matrix[i].reverse()
	}
}
```

**Time complexity:** O(n^2) — transpose is O(n^2) and reversing n rows of length n is also O(n^2).

**Space complexity:** O(1) — both operations are in-place. Only a single temp variable is needed.

### Why This Works Geometrically

Transposing a matrix reflects it along the main diagonal (top-left to bottom-right). Reversing each row then flips it horizontally. The combination of a diagonal reflection followed by a horizontal flip is equivalent to a 90-degree clockwise rotation. You can verify this with a 2x2 example: `[[1,2],[3,4]]` transposes to `[[1,3],[2,4]]` then reverses rows to `[[3,1],[4,2]]`, which is the correct 90-degree clockwise rotation.

### Follow-Up Variations

For a **counter-clockwise rotation**, transpose then reverse each column (or equivalently, reverse each row first then transpose). For a **180-degree rotation**, either apply the 90-degree rotation twice or reverse the entire matrix top-to-bottom then reverse each row.

This function rotates a matrix 90 degrees counter-clockwise using transpose then column reversal.

```typescript
function rotateCounterClockwise(matrix: number[][]): void {
	const n = matrix.length

	// Transpose
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const temp = matrix[i][j]
			matrix[i][j] = matrix[j][i]
			matrix[j][i] = temp
		}
	}

	// Reverse each column
	for (let col = 0; col < n; col++) {
		let top = 0
		let bottom = n - 1
		while (top < bottom) {
			const temp = matrix[top][col]
			matrix[top][col] = matrix[bottom][col]
			matrix[bottom][col] = temp
			top++
			bottom--
		}
	}
}
```

**Time complexity:** O(n^2). **Space complexity:** O(1).

## Transpose and Set Matrix Zeroes

### Transpose a Matrix

Transposing converts rows into columns. For an `m x n` matrix, the transpose is an `n x m` matrix where element `(i, j)` becomes `(j, i)`.

This function creates a new transposed matrix from a rectangular input.

```typescript
function transpose(matrix: number[][]): number[][] {
	const m = matrix.length
	const n = matrix[0].length
	const result: number[][] = Array.from({ length: n }, () =>
		new Array<number>(m)
	)

	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			result[j][i] = matrix[i][j]
		}
	}

	return result
}
```

**Time complexity:** O(m * n). **Space complexity:** O(m * n) for the new matrix.

For square matrices, you can transpose in-place by swapping `matrix[i][j]` with `matrix[j][i]` for all `j > i`, exactly as shown in the rotation section. The relationship between transpose and rotation is direct: a 90-degree clockwise rotation is a transpose followed by a horizontal flip.

### Set Matrix Zeroes

Given an `m x n` matrix, if any element is `0`, set its entire row and column to `0`. The challenge is doing this in-place without corrupting the data you still need to read.

**Naive approach (O(m * n) extra space):** Copy the entire matrix, scan the copy for zeroes, and zero out rows/columns in the original. This works but wastes space.

**O(m + n) space approach:** Use two boolean arrays — one for rows and one for columns — to mark which rows and columns contain a zero. Then iterate the matrix again and zero out marked rows and columns.

This function uses marker arrays to track which rows and columns need zeroing.

```typescript
function setZeroes(matrix: number[][]): void {
	const m = matrix.length
	const n = matrix[0].length
	const zeroRows = new Array<boolean>(m).fill(false)
	const zeroCols = new Array<boolean>(n).fill(false)

	// First pass: find zeroes
	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			if (matrix[i][j] === 0) {
				zeroRows[i] = true
				zeroCols[j] = true
			}
		}
	}

	// Second pass: apply zeroes
	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			if (zeroRows[i] || zeroCols[j]) {
				matrix[i][j] = 0
			}
		}
	}
}
```

**Time complexity:** O(m * n). **Space complexity:** O(m + n).

**O(1) space approach:** Use the first row and first column of the matrix itself as marker arrays. Before doing so, record whether the first row and first column originally contained any zeroes (using two boolean flags). Then scan the rest of the matrix and write markers into the first row/column. Finally, zero out cells based on the markers, and handle the first row/column last based on the saved flags.

This function achieves constant extra space by repurposing the first row and column as markers.

```typescript
function setZeroesOptimal(matrix: number[][]): void {
	const m = matrix.length
	const n = matrix[0].length
	let firstRowHasZero = false
	let firstColHasZero = false

	// Check if first row has zero
	for (let j = 0; j < n; j++) {
		if (matrix[0][j] === 0) firstRowHasZero = true
	}

	// Check if first column has zero
	for (let i = 0; i < m; i++) {
		if (matrix[i][0] === 0) firstColHasZero = true
	}

	// Use first row/col as markers for the rest
	for (let i = 1; i < m; i++) {
		for (let j = 1; j < n; j++) {
			if (matrix[i][j] === 0) {
				matrix[i][0] = 0
				matrix[0][j] = 0
			}
		}
	}

	// Zero out cells based on markers
	for (let i = 1; i < m; i++) {
		for (let j = 1; j < n; j++) {
			if (matrix[i][0] === 0 || matrix[0][j] === 0) {
				matrix[i][j] = 0
			}
		}
	}

	// Handle first row
	if (firstRowHasZero) {
		for (let j = 0; j < n; j++) {
			matrix[0][j] = 0
		}
	}

	// Handle first column
	if (firstColHasZero) {
		for (let i = 0; i < m; i++) {
			matrix[i][0] = 0
		}
	}
}
```

**Time complexity:** O(m * n). **Space complexity:** O(1) — only two boolean variables beyond the input.

## Scenario-Based Questions

These are the follow-up questions interviewers use to probe deeper understanding after you solve the core problems.

### What if the matrix is sparse?

If most elements are zero, the set-zeroes problem becomes trivial (almost everything gets zeroed). But for spiral traversal or rotation, sparsity does not help — you still visit every cell. A sparse matrix representation (storing only non-zero elements as coordinates) could reduce memory but makes traversal patterns harder to implement.

### How would you handle a very large matrix that does not fit in memory?

For the multiplication table, this is a non-issue since you can generate and print one row at a time without storing the full grid. For spiral traversal, you need random access to all four edges of the current boundary, so streaming is not straightforward. One approach is to divide the matrix into blocks that fit in memory and process each spiral layer from disk. Rotation can be done block by block with careful index mapping.

### What changes if the matrix contains non-numeric data?

The multiplication table is inherently numeric, but spiral traversal, rotation, and transpose work on any data type. The set-zeroes problem needs a sentinel value — if the data is strings, you would check for a specific marker (like an empty string) instead of `0`. The TypeScript solutions generalize easily with a generic type parameter.

### Can you parallelize spiral traversal?

Not easily. Spiral order is inherently sequential — each element's position in the output depends on all previous elements. Rotation and transpose, however, are embarrassingly parallel since each output cell depends on exactly one input cell with no data dependencies between cells.

## Rapid Fire

**What is the time complexity of transposing an m x n matrix?**
O(m * n). Every element must be moved exactly once.

**Can you rotate a rectangular (non-square) matrix in-place?**
Not with the transpose-and-reverse trick. Rectangular rotation changes dimensions (m x n becomes n x m), which requires a new allocation.

**What is the difference between clockwise and counter-clockwise rotation?**
Clockwise: transpose then reverse rows. Counter-clockwise: transpose then reverse columns. Alternatively, counter-clockwise is three clockwise rotations.

**How do you detect if a matrix is symmetric?**
A matrix is symmetric if it equals its transpose — `matrix[i][j] === matrix[j][i]` for all i and j. This only applies to square matrices.

**What is the space complexity of spiral traversal excluding the output?**
O(1). Only four boundary pointers are maintained.

**Why start the inner loop at `j = i + 1` during in-place transpose?**
To avoid swapping elements twice. If you swap `(i, j)` and `(j, i)`, you must not also swap `(j, i)` and `(i, j)` later. Starting at `j = i + 1` ensures each pair is swapped exactly once.

## Frequently Asked Questions

### What is the most common matrix question in frontend interviews?

Spiral matrix traversal appears most frequently, followed closely by rotate-matrix-90-degrees. Both test index manipulation and boundary management, skills that transfer to DOM grid layouts and canvas rendering. The multiplication table question is popular at companies that value clean output formatting alongside algorithmic thinking.

### When should you use an in-place approach versus creating a new matrix?

Use in-place when the interviewer explicitly asks for O(1) extra space or when the problem constraints require it (like rotating a large matrix). Creating a new matrix is simpler and less error-prone, so default to it unless space optimization is requested. Always clarify with the interviewer before committing to an approach.

### How do you handle non-square matrices in rotation problems?

You cannot rotate a non-square matrix in-place because the dimensions change. An m x n matrix rotated 90 degrees becomes n x m. Allocate a new matrix of the correct dimensions and map each element: position `(i, j)` in the original maps to `(j, m - 1 - i)` in the rotated output. Transpose-and-reverse only works for square matrices.

### Why does the O(1) set-zeroes solution process the first row and column last?

Because the first row and first column are used as marker arrays during the algorithm. If you zero them out too early based on their own flags, you corrupt the markers that other cells depend on. By processing interior cells first and handling the first row/column as the final step, the markers remain intact throughout the main pass.

### What is the relationship between matrix transpose and 90-degree rotation?

A 90-degree clockwise rotation equals a transpose followed by reversing each row. A 90-degree counter-clockwise rotation equals a transpose followed by reversing each column. The transpose alone is a reflection across the main diagonal, and the reversal adds the flip needed to complete the rotation. Understanding this decomposition lets you derive any rotation direction from the transpose operation.
