import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, LanguageEnum, ProviderEnum, RoleEnum } from 'src/common/enums';
import {generateHash} from 'src/common';
import { OtpDocument } from './otp.model';

@Schema({
  strictQuery: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (value: string) {
      const [firstName, lastName] = value.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: Date,
    required: false,
  })
  confirmEmail: Date;

   @Prop({
    type: Date,
    required: false,
  })
  confirmedAt: Date;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.GOOGLE ? false : true;
    },
  })
  password: string;

  @Prop({ type: String, enum: ProviderEnum, default: ProviderEnum.SYSTEM })
  provider: ProviderEnum;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.user })
  role: RoleEnum;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.male })
  gender: GenderEnum;

  @Prop({ type: String, enum: LanguageEnum, default: LanguageEnum.EN })
  preferredLanguage: LanguageEnum;

  @Prop({
    type: Date,
    required: false,
  })
  changeCredentialsTime: Date;

  @Virtual()
  otp:OtpDocument[]
}

export type HUserDocument = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('otp', {
  localField:'_id',
  foreignField:'createdBy',
  ref:'Otp',
  
})

userSchema.pre("save" , async function (next) {
  if (this.isModified("password")) {
    this.password = await generateHash(this.password)
  }
  next()
})

export const UserModel = MongooseModule.forFeature([
  { name: "User", schema: userSchema },
]);

// export const UserModel = MongooseModule.forFeatureAsync([
//   {
//     name: User.name,
//     useFactory: () => {
//       userSchema.pre('save', async function (next) {
//         if (this.isModified('password')) {
//           this.password = await generateHash(this.password);
//         }
//         next();
//       });
//       return userSchema;
//     },
//   },
// ]);
