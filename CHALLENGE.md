# CHALLENGES:

### Text Processing/Transformations

#### i. General Processing

The extracted is not gauranteed to work perfectly everytime given the high variability in screenshot contents. 

To reduce errors in extraction, we can split the text into blocks that represent a day each. 

First we remove all the line breaks, then go through each day as a regex pattern and find indices for them. 

Using those indices we can break up the larger text into manageable portions that have a somewhat consistent structure to work with

***Before:***

```
Mon 09:15 AM - 05:30 PM 7.75 hrs
a Coverage, NonCoverage, Coverage
Q 20088 - University Village South
Tue 11:00 AM - 04:30 PM 5.00 hrs
@) a Coverage, NonCoverage
© 20088 - University Village South
Wed
(2) - No Shift -
Thu 09:15 AM - 05:00 PM 7.25 hrs
(23) a Coverage, NonCoverage, Coverage
Q 20088 - University Village South
Fri 12:15PM - 04:45 PM 4.50 hrs
© Coverage
© 20088 - University Village South
```

***After:***

```
Mon 09:15 AM - 05:30 PM 7.75 hrsa Coverage, NonCoverage, CoverageQ 20088 - University Village South

Tue 11:00 AM - 04:30 PM 5.00 hrs@) a Coverage, NonCoverage© 20088 - University Village South

Wed(2) - No Shift -

Thu 09:15 AM - 05:00 PM 7.25 hrs(23) a Coverage, NonCoverage, CoverageQ 20088 - University Village South

Fri 12:15PM - 04:45 PM 4.50 hrs© Coverage© 20088 - University Village South
```



Now we can process each day as its own block and extract shift start/end times, as well as store number and location. Without having to worry about other days' shift/store info interfering. 

> We will also have a mechanism that flags down any days with missing/corrupted info so that they can be manually fixed later by the user.

#### ii. Processing Day Blocks

There are  many ways the text can be misextracted, especially spaces not being recognized 100% of the time. So it's important that the regex matchers are succinct and avoid spaces and other characters that are easily missed. 

I tried to make spaces optional in the regex to combat this.

The day that gets extracted can be wrong in a number of ways. One solution was to pay attention to the capitalization and make sure to match the word exactly, including searching for the ' ' that comes after each day in the text. 

The problem is when the big text block is compressed to remove new lines, the days without a shift don't have a ' ' after them. Like Wed up there. The solution was to replace \n with ' ' during the initial compression.

I know that the store info can really be any piece of text, so I really don't want the day to match anything that the store information could possibly be. There's a chance the store info could include the word 'Mon' or 'Fri' in the beginning. 

There will be a report feature eventually to report problems that arise. As well as a self healing feature to help users fix small issues in the moment.
