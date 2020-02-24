const ReviewsService = {
  getReviewsByUserId(db, user_id) {
    return db
      .from("reviewstream_reviews")
      .select("*")
      .where({ user_id })
      .then(rows => {
        return rows;
      });
  },

  getReviewById(db, id) {
    return db
      .from("reviewstream_reviews")
      .select("*")
      .where({ id })
      .first();
  },

  postReview(db, newReview) {
    return db
      .insert(newReview)
      .into("reviewstream_reviews")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  updateReview(db, id, updateReview) {
    return db("reviewstream_reviews")
      .where({ id })
      .update(updateReview);
  },

  deleteReview(db, id) {
    return db("reviewstream_reviews")
      .where({ id })
      .delete();
  }
};

module.exports = ReviewsService;
