import { IsNumber, IsString } from "class-validator"

export class CalcularExchangeRateDto {
    @IsNumber()
    amount: number;
    
    @IsString()
    currencyFrom: string;
    
    @IsString()
    currencyTo: string;
    
}