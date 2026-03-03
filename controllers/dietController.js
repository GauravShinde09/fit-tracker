const Diet = require("../models/diet");

exports.addDiet = async (req, res) => {
  const { user, date, meals, targetCalories } = req.body;

  let diet = await Diet.findOne({ user, date });

  if (diet) {
    diet.meals = meals;
    if (targetCalories !== undefined) {
      diet.targetCalories = targetCalories;
    }
    await diet.save();
  } else {
    diet = await Diet.create({
      user,
      date,
      meals,
      targetCalories: targetCalories || 0
    });
  }

  res.json({ diet });
};
