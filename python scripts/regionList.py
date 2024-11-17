import csv
with open('scores.csv') as csvfile:
    listedRegions = []
    spamreader = csv.reader(csvfile, delimiter=',')
    for row in spamreader:
        
        seen = set()
        if (row[5] not in listedRegions):
            listedRegions.append(row[5])

print(listedRegions)
        