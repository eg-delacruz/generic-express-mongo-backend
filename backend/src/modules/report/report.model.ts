import { Schema, model, Document, Types } from 'mongoose';

export type ReportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface IReport extends Document {
  title: string;
  description: string;
  status: ReportStatus;

  office: Types.ObjectId;
  createdBy: Types.ObjectId;
  modifiedBy?: Types.ObjectId;
  closedBy?: Types.ObjectId;

  resolution?: string;

  attachments: string[]; // Array of file URLs or paths

  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },

    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    closedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    resolution: { type: String },

    attachments: { type: [String], default: [] }, // Array of file URLs or paths

    closedAt: { type: Date },
  },
  { timestamps: true }
);

export const Report = model<IReport>('Report', reportSchema);
