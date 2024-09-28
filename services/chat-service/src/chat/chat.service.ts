// src/chat.service.ts (en el chat-service)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateMessageDto } from './interfaces/create-message.dto';
import { Message } from './interfaces/message.interface';
const moment = require('moment');

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  getDate(): String {
    return moment().format('YYYY-MM-DD hh:mm:ss A');
  }

  private messages = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    content: `Message ${index + 1}`,
    date: new Date(Date.now() - index * 60000).toISOString(), // mensajes generados con fechas anteriores
  }));

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    console.log("llega")
    console.log(createMessageDto)
    createMessageDto.fe_creacion = new Date(String(this.getDate()));
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    await this.messageModel.updateOne(
      { _id: messageId },
      { $addToSet: { readBy: userId } }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      id_user_receptor: userId,
      readBy: { $ne: userId }
    });
  }

  async findAll(page,limit,id_emisor,id_receptor): Promise<Message[]> {
    const messages = await this.messageModel
      .find({        
        $or: [
          { id_user_emisor: new Types.ObjectId(id_emisor),id_user_receptor: new Types.ObjectId(id_receptor) },
          { id_user_emisor: new Types.ObjectId(id_receptor),id_user_receptor: new Types.ObjectId(id_emisor) }
        ]
      })
      .sort({ fe_creacion: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return messages;
  }

  
  async findUser(page,limit,id_emisor): Promise<Message[]> {
    const messages = await this.messageModel.aggregate([
      {
        $match: {
          $or: [
            { id_user_emisor: new Types.ObjectId(id_emisor) },
            { id_user_receptor: new Types.ObjectId(id_emisor) }
          ]
        }
      },
      {
        $sort: { fe_creacion: -1, _id: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$id_user_emisor", new Types.ObjectId(id_emisor)] },
              then: "$id_user_receptor",
              else: "$id_user_emisor"
            }
          },
          latestMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $addFields: {
          "latestMessage.userName": "$user.nombre_apellido",
          "latestMessage.userEmail": "$user.email",
          "latestMessage.userOnline": "$user.online",
          "latestMessage.userAvatar": "$user.avatar"
        }
      },
      {
        $replaceRoot: { newRoot: "$latestMessage" }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]).exec();

      //console.log(messages)

    return messages;
  }

}
