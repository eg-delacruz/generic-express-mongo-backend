import mongoose, { Schema, Document } from 'mongoose';

export interface IOffice extends Document {
  name: string;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const officeSchema: Schema<IOffice> = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt and updatedAt fields automatically
);

export const Office = mongoose.model<IOffice>('Office', officeSchema);
