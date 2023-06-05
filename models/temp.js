const agg = [
  {
    $match: {
      product: new ObjectId("6476feb6284e528159bdfb0e"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
