import boto3
from keyword20_savedf import keyword20

# DynamoDB 객체 생성
AWS_ACCESS_KEY_ID='YOUR_ACCESS_KEY'
AWS_SECRET_ACCESS_KEY='YOUR_SECRET_ACCESS_KEY'
AWS_REGION='ap-northeast-2'

TABLE_NAME = "regionAndKeywords"
dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                          region_name=AWS_REGION)  
table = dynamodb.Table('regionAndKeywords')

df_keywords = keyword20()

# df_keywords 데이터프레임 반복
for index, row in df_keywords.iterrows():
  # 딕셔너리에 데이터 저장 - dynamodb 저장 시 딕셔너리 형태
  item = {
    'region': row['region'],
    'keyword': row['keywords'],
  }

  # DynamoDB 테이블에 항목 삽입
  table.put_item(Item=item)

  # 진행 상황 출력
  print(f"[{index+1}/{len(df_keywords)}] {row['region']} - {row['keywords']} 저장 완료")
