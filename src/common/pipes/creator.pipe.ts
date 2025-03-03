import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { OperatorDto } from '../dto/operator.dto';

@Injectable()
export class CreatorPipe implements PipeTransform {
    constructor(
        @Inject(REQUEST)
        private request: FastifyRequest
    ) {}
    transform(value: OperatorDto) {
        const user = this.request.user;

        value.createBy = user.uid;

        return value;
    }
}
