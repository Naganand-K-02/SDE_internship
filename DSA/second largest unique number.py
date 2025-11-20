def second_largest_unique(nums):
    unique_nums = list(set(nums))
    
    if len(unique_nums) < 2:
        return -1

    unique_nums.sort(reverse=True)
    return unique_nums[1]



print(second_largest_unique([3, 5, 2, 5, 6, 6, 1]))
print(second_largest_unique([7, 7, 7]))
