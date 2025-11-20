# Second Largest Unique Number (Python)

This program finds the **second largest unique** number in a list.  
If a second unique value does not exist, the function returns **-1**.

## Code

```python
def second_largest_unique(nums):
    unique_nums = list(set(nums))
    
    if len(unique_nums) < 2:
        return -1

    unique_nums.sort(reverse=True)
    return unique_nums[1]


print(second_largest_unique([3, 5, 2, 5, 6, 6, 1]))  # Output: 5
print(second_largest_unique([7, 7, 7]))              # Output: -1
```
## How It Works

1. Removes duplicate numbers

2.Sorts the unique values

3.Returns the second largest

4. If only one unique value exists → returns -1
