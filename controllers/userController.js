const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (users.length === 0)
    return res.status(404).json({
      status: 'success',
      data: {
        message: `no student found`,
      },
    });

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    'firstName lastName email form'
  );

  if (!user || user.length === 0)
    return res.status(401).json({
      message: `You are not yet signedIn`,
    });

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        formStatus: user?.form?.status || 'N/A',
      },
    },
  });
});

exports.submitForm = catchAsync(async (req, res, next) => {
  const form = req.body;
  console.log(req.user);
  const user = await User.findById(req?.user?.id);

  console.log(form);

  if (!user)
    return next(new AppError('Please login to continue' + user, 401));
  if (new Date(user?.allowFormSubmitIn).getTime() > Date.now())
    return next(
      new AppError(
        `You can submit another request by, ${new Date(
          user?.allowFormSubmitIn
        ).toLocaleTimeString(navigator.languages, {
          timeStyle: 'short',
        })}`
      )
    );

  await User.findByIdAndUpdate(
    req.user.id,
    { form: { ...form }, allowFormSubmitIn: Date.now() + 30 * 1000 },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'form submitted succesfuly',
  });
});

exports.getAllForms = catchAsync(async (req, res, next) => {
  const forms = await User.find({
    form: { $exists: true, $ne: null },
  }).select('form');

  if (!forms)
    return next(
      new AppError('Please login as an admin to continue', 401)
    );

  res.status(200).json({
    status: 'success',
    data: {
      forms,
    },
  });
});

exports.updateFormStatus = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        'form.status': req.body.status,
        'form.reason': req.body.reason,
      },
    }
  );

  if (!user) {
    return next(
      new AppError(`can't find a user with this email`, 400)
    );
  }

  console.log(
    req.body.email,
    user.email,
    req.body.email === user.email,
    req.body.status === user.form.status,
    req.body.reason === user.form.reason
  );

  res.status(200).json({
    status: 'success',
    message: `status updated succesfully: ${user.form.status}`,
  });
});
