import { IsDecimal, IsEmail, IsNumber, IsString, MinLength } from "class-validator"

export class CreateExchangeRateDto {
    @IsString()
    currencyFrom: string;
    
    @IsString()
    currencyTo: string;
    
    @IsNumber()
    rate: number;
}